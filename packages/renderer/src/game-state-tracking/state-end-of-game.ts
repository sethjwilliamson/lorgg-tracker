import axios, { AxiosResponse } from "axios";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { ipcRenderer } from "electron";
import { ExportData, State } from "./state";
import { StateMenus } from "./state-menus";

dayjs.extend(utc);

export type GetMostRecentMatchResponse = {
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
  public afterStateChange() {
    this.endTime = dayjs();
  }

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

        let exportData: ExportData = {
          mulliganCards: this.mulliganCards,
          startingCards: this.startingCards,
          timeline: this.timeline,
          roundNumber: this.roundNumber,
          cardsInHand: this.cardsInHand,
          championRoundLeveledUp: this.championRoundLeveledUp,
          endTime: (this.endTime as Dayjs)?.toDate(),
        };

        console.log(exportData);

        ipcRenderer.send("update-local-database", response.data, exportData);

        // this.updateLocalDatabase(response.data);

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
}
