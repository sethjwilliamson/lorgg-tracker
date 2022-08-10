import axios, { AxiosResponse } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ipcRenderer } from "electron";
import { State } from "./state";
import { StateMenus } from "./state-menus";
import { User } from "../../../models/user";
import { MatchPlayer } from "../../../models/matchPlayer";
import { MatchItem } from "../../../models/matchItem";
import { Deck } from "../../../models/deck";
import { Archetype } from "../../../models/archetype";
import { CardItem } from "../../../models/cardItem";
import { ArchetypeTag } from "../../../models/archetypeTag";
import { CardDeck } from "packages/models/cardDeck";
import {
  CardCodeAndCount,
  Deck as LorDeck,
  getDeckFromCode,
} from "lor-deckcodes-ts";

dayjs.extend(utc);

type GetMostRecentMatchResponse = {
  user_id: number;
  user_display_name: string;
  user_tag_line: string;
  user_server: string;
  match_player_id: number;
  match_player_is_victory: boolean;
  match_player_is_first: boolean;
  match_item_id: number;
  match_item_riot_match_id: string;
  match_item_game_mode: string;
  match_item_game_type: string;
  match_item_server: string;
  match_item_started_at: string;
  match_opponent_id: number;
  match_opponent_is_victory: boolean;
  match_opponent_is_first: boolean;
  opponent_id: number;
  opponent_display_name: string;
  opponent_tag_line: string;
  opponent_server: string;
  deck_id: number;
  deck_deck_code: string;
  opponent_deck_id: number;
  opponent_deck_deck_code: string;
  archetype_id: number;
  archetype_cards: string;
  archetype_regions: string;
  opponent_archetype_id: number;
  opponent_archetype_cards: string;
  opponent_archetype_regions: string;
};

export class StateEndOfGame extends State {
  public afterStateChange() {}

  public handle() {
    this.context.transitionTo(new StateMenus());
  }

  public checkForStateChange() {}

  public beforeStateChange() {
    setTimeout(() => this.findCorrespondingMatch(5), 10000);
    console.log(this);
    console.log("SENT FOR CORRESPONDING MATCH");
  }

  private findCorrespondingMatch(triesLeft: number) {
    if (triesLeft <= 0) {
      console.log("COULD NOT FINd IN 5 TRIES");
      console.log("GIVING UP");
      return;
    }
    console.log("SENDING REQUEST");
    console.log(this);
    axios
      .get("https://lor.gg/api/tokens/getMostRecentMatch", {
        headers: {
          Authorization: `Bearer ${this.store.get("token")}`,
        },
      })
      .then((response: AxiosResponse<GetMostRecentMatchResponse>) => {
        console.log(response.data);

        if (!this.checkIfMatchIsCorrect(response.data)) {
          console.log("DID NOT FIND. REDOING IN 5 SECONDS");
          return setTimeout(
            () => this.findCorrespondingMatch(triesLeft - 1),
            5000
          );
        }

        this.sendLocalDataToServer(response.data);

        this.updateLocalDatabase(response.data);

        this.store.set("last-refresh", dayjs());

        ipcRenderer.send("cross-renderer-comm", "match-history-refreshed");
      });
  }

  private checkIfMatchIsCorrect(data: GetMostRecentMatchResponse): boolean {
    // TODO: Make sure there are no issues when a new state is created

    // If deckcode does not match, return false
    if (data.deck_deck_code !== this.deckCode) {
      console.log("DECK CODE DID NOT MATCH");
      return false;
    }

    // If match start time is within a minute, return true
    if (
      dayjs
        .utc(data.match_item_started_at)
        .diff(this.startTime, "minute", true) < 1
    ) {
      console.log("MATCH START TIME WAS WITHIN 1 MINUTE");
      return true;
    }

    // If opponent name matches, return true
    if (data.opponent_display_name === this.opponentName) {
      console.log("OPPONENT NAME DID MATCH");
      return true;
    }

    console.log("RETURNING FALSE");
    return false;
  }

  private sendLocalDataToServer(data: GetMostRecentMatchResponse) {}

  private async updateLocalDatabase(data: GetMostRecentMatchResponse) {
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

    const [localArchetype, localArchetypeCreated] =
      await Archetype.findOrCreate({
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
      await this.addArchetypeTagsToArchetype(
        data.archetype_cards.split(","),
        "Card",
        localArchetype
      );
      await this.addArchetypeTagsToArchetype(
        data.archetype_regions.split(","),
        "Region",
        localArchetype
      );
    }

    if (localDeckCreated) {
      await this.addCardsToDeck(
        getDeckFromCode(data.deck_deck_code),
        localDeck
      );
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

    if (opponentArchetypeCreated) {
      await this.addArchetypeTagsToArchetype(
        data.opponent_archetype_cards.split(","),
        "Card",
        opponentArchetype
      );
      await this.addArchetypeTagsToArchetype(
        data.opponent_archetype_regions.split(","),
        "Region",
        opponentArchetype
      );
    }

    if (opponentDeckCreated) {
      await this.addCardsToDeck(
        getDeckFromCode(data.opponent_deck_deck_code),
        opponentDeck
      );
    }
  }

  private async addArchetypeTagsToArchetype(
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

  private async addCardsToDeck(cardsInDeck: LorDeck, deck: Deck) {
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
}
