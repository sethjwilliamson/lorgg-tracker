import { AxiosResponse } from "axios";
import {
  Card,
  CardPositionRectangle,
  LocalApiResponse,
  PositionalRectanglesResponse,
  State,
} from "./state";
import { StateMenus } from "./state-menus";
import { ipcRenderer } from "electron";

export class StateInGame extends State {
  private cardsInHand: Array<Card> = [];
  private cardsInHandTemp: Array<Card> = [];
  private cardsPendingPlay: Array<Card> = [];
  private opponentCards: Array<Card> = [];
  private previousDrawCardId: Number = 0;

  public afterStateChange() {
    this.cardsInHand = this.startingCards || [];
  }

  public handle() {
    this.callLocalApiEndpoint("positional-rectangles").then(
      (response: AxiosResponse<LocalApiResponse>) => {
        const { data } =
          response as AxiosResponse<PositionalRectanglesResponse>;

        if (data.GameState === "Menus") {
          this.context.transitionTo(new StateMenus());
        }

        if (this.shouldSkipRectangles(data.Rectangles)) {
          console.log("Skipping because no change");
          return;
        }

        this.updateHand(data, data.Rectangles);

        let didDraw = this.checkForDraw(data, data.Rectangles);

        if (didDraw || this.checkEnemyAction(data.Rectangles)) {
          let played = this.cardsInHand.filter(({ CardID }) => {
            return (
              this.cardsInHandTemp.map((x) => x.CardID).indexOf(CardID) == -1
            );
          });

          console.log("Played");
          console.log(played);

          this.cardsInHand = this.cardsInHandTemp;
        }
      }
    );
  }

  public checkForStateChange() {
    this.callLocalApiEndpoint("positional-rectangles").then(
      (response: AxiosResponse<LocalApiResponse>) => {
        const { data } =
          response as AxiosResponse<PositionalRectanglesResponse>;

        if (data.GameState === "Menus") {
          this.context.transitionTo(new StateMenus());
        }
      }
    );
  }

  public beforeStateChange() {}

  private checkForDraw(
    response: PositionalRectanglesResponse,
    rectangles: Array<CardPositionRectangle>
  ): Card | null {
    for (let rectangle of rectangles) {
      if (
        rectangle.Width / rectangle.Height > 0.68 &&
        rectangle.Width / rectangle.Height < 0.72 &&
        rectangle.Height > response.Screen.ScreenHeight * 0.4 &&
        rectangle.Height < response.Screen.ScreenHeight * 0.5 &&
        rectangle.LocalPlayer &&
        rectangle.CardID !== this.previousDrawCardId
      ) {
        this.previousDrawCardId = rectangle.CardID;
        console.log("DRAW");
        return {
          CardCode: rectangle.CardCode,
          CardID: rectangle.CardID,
          LocalPlayer: rectangle.LocalPlayer,
        };
      }
    }

    return null;
  }

  private updateHand(
    response: PositionalRectanglesResponse,
    rectangles: Array<CardPositionRectangle>
  ): void {
    if (rectangles.length === 0) {
      return;
    }

    this.cardsInHandTemp = rectangles
      .filter(
        (x) =>
          x.LocalPlayer &&
          (x.TopLeftY - x.Height <= 0 ||
            (x.Width / x.Height >= 0.68 && x.Width / x.Height <= 0.72))
      )
      .map((x) => {
        return {
          CardCode: x.CardCode,
          CardID: x.CardID,
          LocalPlayer: x.LocalPlayer,
        };
      });
  }

  private checkEnemyAction(rectangles: Array<CardPositionRectangle>): Boolean {
    let opponentCardsTemp = rectangles
      .filter((x) => !x.LocalPlayer && x.CardCode !== "face")
      .map((x) => {
        return {
          CardCode: x.CardCode,
          CardID: x.CardID,
          LocalPlayer: x.LocalPlayer,
        };
      });

    let opponentPlayedCards = opponentCardsTemp.filter(({ CardID }) => {
      return this.opponentCards.map((x) => x.CardID).indexOf(CardID) == -1;
    });

    let opponentChangedCards = opponentPlayedCards.concat(
      this.opponentCards.filter(({ CardID }) => {
        return opponentCardsTemp.map((x) => x.CardID).indexOf(CardID) == -1;
      })
    );

    this.opponentCards = opponentCardsTemp;

    // TODO: Remove the if
    if (opponentChangedCards.length > 0) {
      console.log("OPPONENT ACTION");
      console.log(opponentChangedCards);
      return true;
    }

    return false;
  }
}
