import { AxiosResponse } from "axios";
import {
  CardPositionRectangle,
  LocalApiResponse,
  PositionalRectanglesResponse,
  State,
} from "./state";
import { StateInGame } from "./state-in-game";
import { StateMenus } from "./state-menus";

export class StateMulligan extends State {
  public afterStateChange() {}

  public handle() {}

  public checkForStateChange() {
    this.callLocalApiEndpoint("positional-rectangles").then(
      (response: AxiosResponse<LocalApiResponse>) => {
        const { data } =
          response as AxiosResponse<PositionalRectanglesResponse>;

        if (data.GameState === "Menus") {
          this.context.transitionTo(new StateMenus());
          return;
        }

        if (this.shouldSkipRectangles(data.Rectangles)) {
          console.log("Skipping because no change");
          return;
        }

        this.checkIfMulligan(data.Rectangles);
      }
    );
  }

  private checkIfMulligan(rectangles: Array<CardPositionRectangle>) {
    if (
      rectangles.filter((x) => x.LocalPlayer && x.CardCode !== "face").length <
      4
    ) {
      return;
    }

    if (
      rectangles.filter((x) => x.LocalPlayer && x.CardCode !== "face").length >
      4
    ) {
      this.updateStartingCards(rectangles);
      this.context.transitionTo(new StateInGame(this));
      return;
    }

    if (rectangles.filter((x) => !x.LocalPlayer).length > 1) {
      this.context.transitionTo(new StateInGame(this));
      return;
    }

    if (this.mulliganCards) {
      return;
    }

    this.mulliganCards = rectangles
      .filter((x) => x.LocalPlayer && x.CardCode !== "face")
      .map((x) => {
        return {
          CardCode: x.CardCode,
          CardID: x.CardID,
          LocalPlayer: x.LocalPlayer,
        };
      });
  }

  private updateStartingCards(rectangles: Array<CardPositionRectangle>) {
    this.startingCards = rectangles.filter(
      (x) => x.LocalPlayer && x.CardCode !== "face"
    );
  }

  public beforeStateChange() {
    this.callLocalApiEndpoint("positional-rectangles").then(
      (response: AxiosResponse<LocalApiResponse>) => {
        const { data } =
          response as AxiosResponse<PositionalRectanglesResponse>;

        if (data.GameState === "Menus") {
          this.context.transitionTo(new StateMenus());
          return;
        }

        this.startingCards = data.Rectangles.filter(
          (x) => x.LocalPlayer && x.CardCode !== "face"
        ).map((x) => {
          return {
            CardCode: x.CardCode,
            CardID: x.CardID,
            LocalPlayer: x.LocalPlayer,
          };
        });
      }
    );
  }
}
