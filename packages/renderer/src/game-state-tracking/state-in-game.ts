import { AxiosResponse } from "axios";
import {
  Card,
  CardPositionRectangle,
  LocalApiResponse,
  PositionalRectanglesResponse,
  State,
  LocalCard,
} from "./state";
import { StateMenus } from "./state-menus";
import { ipcRenderer } from "electron";
const scan = require("node-process-memory-scanner");

type Timeline = {
  self: Array<{
    roundNumber: Number;
    cards: Array<Card | LocalCard>;
  }>;
  opponent: Array<{
    roundNumber: Number;
    cards: Array<Card>;
  }>;
};

export class StateInGame extends State {
  private cardsInHand: Array<LocalCard> = [];
  private cardsInHandTemp: Array<LocalCard> = [];
  private cardsPendingPlay: Array<LocalCard> = [];
  private opponentCards: Array<Card> = [];
  private previousDrawCardId: number = 0;
  private roundNumber: number = 0;
  private timeline: Timeline = {
    self: [],
    opponent: [],
  };

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

        let isNewRound = didDraw && this.checkForRoundChange();

        if (didDraw || this.checkEnemyAction(data.Rectangles)) {
          // Update Round Added to Hand
          this.cardsInHandTemp = this.cardsInHandTemp.map((x) => {
            return {
              CardCode: x.CardCode,
              CardID: x.CardID,
              LocalPlayer: x.LocalPlayer,
              RoundAddedToHand:
                this.cardsInHand.find((y) => y.CardID === x.CardID)
                  ?.RoundAddedToHand || this.roundNumber,
            };
          });

          let played = this.cardsInHand.filter(({ CardID }) => {
            return (
              this.cardsInHandTemp.map((x) => x.CardID).indexOf(CardID) == -1
            );
          });

          console.log("Played");
          console.log(played);

          this.addCardsToTimeline(
            played,
            isNewRound ? this.roundNumber - 1 : this.roundNumber
          );

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

  public beforeStateChange() {
    console.log(this.timeline);
  }

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
          RoundAddedToHand: this.roundNumber,
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

    this.addCardsToTimeline(opponentPlayedCards, this.roundNumber);

    // TODO: Remove the if
    if (opponentChangedCards.length > 0) {
      console.log("OPPONENT ACTION");
      console.log(opponentChangedCards);
      return true;
    }

    return false;
  }

  private checkForRoundChange(): boolean {
    const firstMatch = scan(
      "Legends of Runeterra",
      `ROUND (${this.roundNumber + 1})(?![0-9]+)`
    );

    console.log(firstMatch);

    if (firstMatch === "MATCH NOT FOUND") {
      return false;
    }

    this.roundNumber++;

    console.log(`ROUND ${this.roundNumber}`);

    this.timeline.self.push({
      roundNumber: this.roundNumber,
      cards: [],
    });

    this.timeline.opponent.push({
      roundNumber: this.roundNumber,
      cards: [],
    });

    return true;
  }

  private addCardsToTimeline(cards: Array<Card>, roundNumber: number) {
    var test = false;
    for (let card of cards) {
      test = true;
      this.timeline[card.LocalPlayer ? "self" : "opponent"]
        .find((x) => x.roundNumber === roundNumber)
        ?.cards.push(card);
    }

    if (test) {
      console.log(this.timeline);
    }
  }
}
