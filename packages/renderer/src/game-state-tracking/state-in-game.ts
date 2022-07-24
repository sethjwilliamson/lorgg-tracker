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
    cards: Array<LocalCard>;
  }>;
  opponent: Array<{
    roundNumber: Number;
    cards: Array<Card>;
  }>;
};

export class StateInGame extends State {
  private cardsInHand: Array<LocalCard> = [];
  private cardsInHandTemp: Array<LocalCard> = [];
  private cardsPendingPlay: Array<LocalCard> = []; // Should only be needed for cases like discard
  private opponentCards: Array<Card> = [];
  private previousDrawCardId: number = 0;
  private roundNumber: number = 0;
  private isCheckingRound: boolean = false;
  private timeline: Timeline = {
    self: [],
    opponent: [],
  };
  private cardsPlayedThisRoundSelf: Array<LocalCard> = [];
  private cardsPlayedThisRoundOpponent: Array<Card> = [];

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

        let cardDrawn = this.checkForDraw(data, data.Rectangles);

        if (cardDrawn || this.checkEnemyAction(data.Rectangles)) {
          // Update Round Added to Hand
          this.updateCardsPlayedThisRound(cardDrawn);
        }

        if (cardDrawn) {
          this.checkForRoundChange();
        }
      }
    );
  }

  private updateCardsPlayedThisRound(cardDrawn: boolean) {
    this.cardsInHandTemp = this.cardsInHandTemp.map((x) => {
      let currentRound =
        this.isCheckingRound || cardDrawn ? null : this.roundNumber;

      return {
        CardCode: x.CardCode,
        CardID: x.CardID,
        LocalPlayer: x.LocalPlayer,
        RoundAddedToHand:
          this.cardsInHand.find((y) => y.CardID === x.CardID)
            ?.RoundAddedToHand || currentRound,
      };
    });

    let played = this.cardsInHand.filter(({ CardID }) => {
      return this.cardsInHandTemp.map((x) => x.CardID).indexOf(CardID) == -1;
    });

    console.log("Played");
    console.log(played);

    this.addCardsToTimeline(played);

    this.cardsInHand = this.cardsInHandTemp;
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
    this.addTempToTimeline(false);

    console.log(this.timeline);
  }

  private checkForDraw(
    response: PositionalRectanglesResponse,
    rectangles: Array<CardPositionRectangle>
  ): boolean {
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

        this.onDraw({
          CardCode: rectangle.CardCode,
          CardID: rectangle.CardID,
          LocalPlayer: rectangle.LocalPlayer,
        });

        return true;
      }
    }

    return false;
  }

  private onDraw(card: Card) {}

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
          RoundAddedToHand: null,
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

    this.addCardsToTimeline(opponentPlayedCards);

    this.opponentCards = opponentCardsTemp;

    return opponentChangedCards.length > 0;
  }

  private checkForRoundChange(): void {
    console.log("START ROUND SEARCH");
    this.isCheckingRound = true;
    scan("Legends of Runeterra", `ROUND (${this.roundNumber + 1})`).then(
      (response: string) => {
        this.isCheckingRound = false;

        this.onRoundCheckDone(response);
      }
    );

    console.log("DURING ROUNCH SEARCH");
  }

  private onRoundCheckDone(response: string): void {
    let isNewRound =
      response !== "MATCH NOT FOUND" && !response.includes("ERROR");

    if (isNewRound) {
      this.roundNumber++;

      this.timeline.self.push({
        roundNumber: this.roundNumber,
        cards: [],
      });

      this.timeline.opponent.push({
        roundNumber: this.roundNumber,
        cards: [],
      });
    }

    this.addTempToTimeline(isNewRound);
  }

  private addTempToTimeline(isNewRound: boolean) {
    let selfTimelineThisRoundCards = this.timeline.self.find(
      (x) => x.roundNumber === this.roundNumber
    )?.cards as Array<LocalCard>;

    for (let card of this.cardsPlayedThisRoundSelf) {
      selfTimelineThisRoundCards.push(card);
    }

    for (let card of this.cardsPlayedThisRoundOpponent) {
      this.timeline.opponent
        .find((x) => x.roundNumber === this.roundNumber)
        ?.cards.push(card);
    }

    this.cardsPlayedThisRoundSelf = [];
    this.cardsPlayedThisRoundOpponent = [];

    for (let card of this.timeline.self.find(
      (x) => x.roundNumber === this.roundNumber
    )?.cards as Array<LocalCard>) {
      console.log(card.RoundAddedToHand);
      if (card.RoundAddedToHand === null) {
        console.log(card);
        card.RoundAddedToHand = this.roundNumber;
        console.log(card);
      }
    }

    for (let card of this.timeline.self.find(
      (x) => x.roundNumber === this.roundNumber - 1
    )?.cards as Array<LocalCard>) {
      console.log("PREVIOUS ROUND");
      console.log(card.RoundAddedToHand);
      if (card.RoundAddedToHand === null) {
        console.log(card);
        card.RoundAddedToHand = this.roundNumber - 1;
        console.log(card);
      }
    }

    // TODO: Remove this
    if (isNewRound) {
      console.log(this.timeline);
    }
  }

  private addCardsToTimeline(cards: Array<Card | LocalCard>) {
    if (this.isCheckingRound) {
      return this.addCardsToTempTimeline(cards);
    }

    for (let card of cards) {
      this.timeline[card.LocalPlayer ? "self" : "opponent"]
        .find((x) => x.roundNumber === this.roundNumber)
        ?.cards.push(card);
    }
  }

  private addCardsToTempTimeline(cards: Array<Card | LocalCard>) {
    for (let card of cards) {
      (card.LocalPlayer
        ? this.cardsPlayedThisRoundSelf
        : this.cardsPlayedThisRoundOpponent
      ).push(card);
    }
  }
}
