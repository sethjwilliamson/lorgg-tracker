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
dayjs.extend(utc);

ipcMain.on(
  "update-local-database",
  (event, data: GetMostRecentMatchResponse) => {
    console.log(data);
    updateLocalDatabase(data);
  }
);

async function updateLocalDatabase(data: GetMostRecentMatchResponse) {
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
