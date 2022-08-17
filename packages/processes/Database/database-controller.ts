import { ipcMain } from "electron";
import {
  CardCodeAndCount,
  Deck as LorDeck,
  getDeckFromCode,
} from "lor-deckcodes-ts";
import {
  Archetype,
  CardDeck,
  CardItem,
  Deck,
  MatchItem,
  MatchPlayer,
  User,
} from "../../../packages/models";
import { GetMostRecentMatchResponse } from "../../../packages/renderer/src/game-state-tracking/state-end-of-game";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ExportData } from "packages/renderer/src/game-state-tracking/state";
dayjs.extend(utc);

ipcMain.on(
  "update-local-database",
  async (event, data: GetMostRecentMatchResponse, exportData: ExportData) => {
    console.log(data);
    await updateLocalDatabase(data, exportData);
    sendDataToServer(data.match_player_id);
  }
);

async function updateLocalDatabase(
  data: GetMostRecentMatchResponse,
  exportData: ExportData
) {
  const [localUser, localUserCreated] = await User.findOrCreate({
    where: { id: data.user_id },
    defaults: {
      // id: data.match_player_id,
      displayName: data.user_display_name,
      tagLine: data.user_tag_line,
      server: data.user_server,
    },
  });

  const [localMatchPlayer, localMatchPlayerCreated] =
    await MatchPlayer.findOrCreate({
      where: {
        id: data.match_player_id,
      },
      defaults: {
        id: data.match_player_id,
        isVictory: data.match_player_is_victory,
        isFirst: data.match_player_is_first,
      },
    });

  const [matchItem, matchItemCreated] = await MatchItem.findOrCreate({
    where: {
      id: data.match_item_id,
    },
    defaults: {
      id: data.match_item_id,
      riotMatchId: data.match_item_riot_match_id,
      gameMode: data.match_item_game_mode,
      gameType: data.match_item_game_type,
      server: data.match_item_server,
      startedAt: dayjs.utc(data.match_item_started_at).toDate(),
    },
  });

  const [localDeck, localDeckCreated] = await Deck.findOrCreate({
    where: {
      id: data.deck_id,
    },
    defaults: {
      id: data.deck_id,
      deckCode: data.deck_deck_code,
    },
  });

  const [localArchetype, localArchetypeCreated] = await Archetype.findOrCreate({
    where: {
      id: data.archetype_id,
    },
    defaults: {
      id: data.archetype_id,
    },
  });

  await localMatchPlayer.setUser(localUser);
  await localMatchPlayer.setMatchItem(matchItem);
  await localMatchPlayer.setDeck(localDeck);

  if (localArchetypeCreated) {
    await addArchetypeTagsToArchetype(
      data.archetype_cards.split(","),
      "Card",
      localArchetype
    );
    await addArchetypeTagsToArchetype(
      data.archetype_regions.split(","),
      "Region",
      localArchetype
    );
  }

  if (localDeckCreated) {
    await addCardsToDeck(getDeckFromCode(data.deck_deck_code), localDeck);
  }

  await addTrackerInfoToDb(localMatchPlayer, exportData);

  if (data.opponent_id === null) {
    return;
  }

  const [opponentUser, opponentUserCreated] = await User.findOrCreate({
    where: {
      id: data.opponent_id,
    },
    defaults: {
      id: data.opponent_id,
      displayName: data.opponent_display_name,
      tagLine: data.opponent_tag_line,
      server: data.opponent_server,
    },
  });

  const [opponentMatchPlayer, opponentMatchPlayerCreated] =
    await MatchPlayer.findOrCreate({
      where: {
        id: data.match_opponent_id,
      },
      defaults: {
        id: data.match_opponent_id,
        isVictory: data.match_opponent_is_victory,
        isFirst: data.match_opponent_is_first,
      },
    });

  const [opponentDeck, opponentDeckCreated] = await Deck.findOrCreate({
    where: {
      id: data.opponent_deck_id,
    },
    defaults: {
      id: data.opponent_deck_id,
      deckCode: data.opponent_deck_deck_code,
    },
  });

  const [opponentArchetype, opponentArchetypeCreated] =
    await Archetype.findOrCreate({
      where: {
        id: data.opponent_archetype_id,
      },
      defaults: {
        id: data.opponent_archetype_id,
      },
    });

  await opponentMatchPlayer.setUser(opponentUser);
  await opponentMatchPlayer.setMatchItem(matchItem);
  await opponentMatchPlayer.setDeck(opponentDeck);

  if (opponentArchetypeCreated) {
    await addArchetypeTagsToArchetype(
      data.opponent_archetype_cards.split(","),
      "Card",
      opponentArchetype
    );
    await addArchetypeTagsToArchetype(
      data.opponent_archetype_regions.split(","),
      "Region",
      opponentArchetype
    );
  }

  if (opponentDeckCreated) {
    await addCardsToDeck(
      getDeckFromCode(data.opponent_deck_deck_code),
      opponentDeck
    );
  }

  await addOpponentTrackerInfoToDb(opponentMatchPlayer, exportData);
}

async function addArchetypeTagsToArchetype(
  archetypeCardCodes: Array<string>,
  key: string,
  archetype: Archetype
) {
  for (let archetypeCardCode of archetypeCardCodes) {
    // TODO: Add quantity and operator when necessary

    await archetype.createArchetypeTag({
      tag: key,
      value: archetypeCardCode,
    });
  }
}

async function addCardsToDeck(cardsInDeck: LorDeck, deck: Deck) {
  let cardDecks: Array<CardDeck> = [];

  for (let cardInDeck of cardsInDeck) {
    let card: CardItem | null = await CardItem.findOne({
      where: { cardCode: cardInDeck.cardCode },
    });

    if (card === null) {
      // TODO: Run find card items
      console.error("CARD ITEM NOT FOUND");
      continue;
    }

    cardDecks.push(
      await card.createCardDeck({
        quantity: cardInDeck.count,
      })
    );
  }

  await deck.addCardDecks(cardDecks);
}

async function addTrackerInfoToDb(
  matchPlayer: MatchPlayer,
  exportData: ExportData
) {
  console.log(exportData);

  let trackerMatchInfo = await matchPlayer.createTrackerMatchInfo({
    roundGameEnded: exportData.roundNumber,
    endedAt: exportData.endTime,
  });

  let cardsKeptInMulligan = exportData.mulliganCards.filter((x) =>
    exportData.startingCards.some((y) => y.CardID === x.CardID)
  );

  for (let round of exportData.timeline.self) {
    for (let playedCard of round.playedCards) {
      let wasInMulligan = exportData.mulliganCards.some(
        (x) => x.CardID === playedCard.CardID
      );

      let wasKeptInMulligan = wasInMulligan
        ? cardsKeptInMulligan.some((x) => x.CardID === playedCard.CardID)
        : null;

      let timeline = await trackerMatchInfo.createTimeline({
        roundAddedToHand: playedCard.RoundAddedToHand || exportData.roundNumber,
        roundPlayed: round.roundNumber,
        wasDrawn: playedCard.wasDrawn,
        wasInMulligan: wasInMulligan,
        wasKeptInMulligan: wasKeptInMulligan,
        roundChampionLeveledUp:
          exportData.championRoundLeveledUp[playedCard.CardCode],
      });

      let cardItem = await CardItem.findOne({
        where: { cardCode: playedCard.CardCode },
      });

      if (cardItem === null) {
        console.error("CARD ITEM NOT FOUND");
        continue;
      }

      timeline.setCardItem(cardItem);
    }
  }

  for (let drawnCard of exportData.cardsInHand) {
    let wasInMulligan = exportData.mulliganCards.some(
      (x) => x.CardID === drawnCard.CardID
    );

    let wasKeptInMulligan = wasInMulligan
      ? cardsKeptInMulligan.some((x) => x.CardID === drawnCard.CardID)
      : null;

    let timeline = await trackerMatchInfo.createTimeline({
      roundAddedToHand: drawnCard.RoundAddedToHand || exportData.roundNumber,
      roundPlayed: null,
      wasDrawn: drawnCard.wasDrawn,
      wasInMulligan: wasInMulligan,
      wasKeptInMulligan: wasKeptInMulligan,
      roundChampionLeveledUp:
        exportData.championRoundLeveledUp[drawnCard.CardCode],
    });

    let cardItem = await CardItem.findOne({
      where: { cardCode: drawnCard.CardCode },
    });

    if (cardItem === null) {
      console.error("CARD ITEM NOT FOUND");
      continue;
    }

    await timeline.setCardItem(cardItem);
  }

  console.log(exportData.startingCards);
  console.log(exportData.mulliganCards);

  for (let mulliganCard of exportData.mulliganCards) {
    // Skip kept mulligan cards
    if (
      exportData.startingCards.some((x) => x.CardID === mulliganCard.CardID)
    ) {
      continue;
    }

    let timeline = await trackerMatchInfo.createTimeline({
      roundAddedToHand: null,
      roundPlayed: null,
      wasDrawn: false,
      wasInMulligan: true,
      wasKeptInMulligan: false,
      roundChampionLeveledUp:
        exportData.championRoundLeveledUp[mulliganCard.CardCode],
    });

    let cardItem = await CardItem.findOne({
      where: { cardCode: mulliganCard.CardCode },
    });

    if (cardItem === null) {
      console.error("CARD ITEM NOT FOUND");
      continue;
    }

    await timeline.setCardItem(cardItem);
  }
}

async function addOpponentTrackerInfoToDb(
  opponentMatchPlayer: MatchPlayer,
  exportData: ExportData
) {
  let trackerMatchInfo = await opponentMatchPlayer.createTrackerMatchInfo({
    roundGameEnded: exportData.roundNumber,
    endedAt: exportData.endTime,
  });

  for (let round of exportData.timeline.opponent) {
    for (let playedCard of round.playedCards) {
      let timeline = await trackerMatchInfo.createTimeline({
        roundAddedToHand: null,
        roundPlayed: round.roundNumber,
        wasDrawn: true,
        wasInMulligan: false,
        wasKeptInMulligan: null,
        roundChampionLeveledUp: null,
      });

      let cardItem = await CardItem.findOne({
        where: { cardCode: playedCard.CardCode },
      });

      if (cardItem === null) {
        console.error("CARD ITEM NOT FOUND");
        continue;
      }

      timeline.setCardItem(cardItem);
    }
  }
}

function sendDataToServer(matchPlayerId: number) {
  // axios.post
}
