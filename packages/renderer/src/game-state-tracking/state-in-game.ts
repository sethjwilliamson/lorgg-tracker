import { AxiosResponse } from "axios";
import {
  Card,
  CardPositionRectangle,
  LocalApiResponse,
  PositionalRectanglesResponse,
  State,
  LocalCard,
  StaticDecklistResponse,
} from "./state";
import { StateMenus } from "./state-menus";
import { ipcRenderer } from "electron";
import dayjs from "dayjs";
import { StateEndOfGame } from "./state-end-of-game";
import {
  setJson,
  SetJsonCard,
  setJsonObject,
} from "../../../processes/Jsons/json-controller";
const scan = require("node-process-memory-scanner");

export class StateInGame extends State {
  private cardsInHandTemp: Array<LocalCard> = [];
  private cardIdsPendingPlay: Set<number> = new Set(); // Should only be needed for cases like discard
  private opponentCards: Array<Card> = [];
  private previousDrawCardId: number = 0;
  private isCheckingRound: boolean = false;
  private drawnCards: Array<Card> = [];
  private cardsPlayedThisRoundSelf: Array<LocalCard> = [];
  private cardsPlayedThisRoundOpponent: Array<Card> = [];
  private decklist!: { [key: string]: number };
  private champLevelingRectangles: Array<CardPositionRectangle> = [];

  public afterStateChange() {
    this.cardsInHand = this.startingCards || [];

    for (let card of this.startingCards) {
      this.drawnCards.push(card);
    }

    this.callLocalApiEndpoint("static-decklist").then(
      (response: AxiosResponse<LocalApiResponse>) => {
        const { data } = response as AxiosResponse<StaticDecklistResponse>;

        if (data.CardsInDeck === null) {
          console.error("data.CardsInDeck === null");
          this.decklist = {};
          return;
        }

        this.deckCode = data.DeckCode;
        this.decklist = data.CardsInDeck;

        this.implementChampionLeveledUpObject();
      }
    );
  }

  public handle() {
    this.callLocalApiEndpoint("positional-rectangles").then(
      (response: AxiosResponse<LocalApiResponse>) => {
        const { data } =
          response as AxiosResponse<PositionalRectanglesResponse>;

        if (!this.opponentName) {
          this.opponentName = data.OpponentName;
        }

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

  private implementChampionLeveledUpObject() {
    for (let cardCode in this.decklist) {
      if (!(cardCode in setJsonObject)) {
        continue;
      }

      if (setJsonObject[cardCode].supertype.length === 0) {
        continue;
      }

      this.championRoundLeveledUp[cardCode] = 0;
    }

    console.log(this.championRoundLeveledUp);
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
        wasDrawn: this.drawnCards.some((y) => y.CardID === x.CardID),
      };
    });

    console.log(this.cardIdsPendingPlay);

    let played = this.cardsInHand.filter(({ CardID }) => {
      return (
        this.cardsInHandTemp.map((x) => x.CardID).indexOf(CardID) == -1 &&
        this.cardIdsPendingPlay.has(CardID)
      );
    });

    this.cardIdsPendingPlay.clear();

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
          this.context.transitionTo(new StateEndOfGame(this));
        }
      }
    );
  }

  public beforeStateChange() {
    this.endTime = dayjs();
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

  private onDraw(card: Card) {
    this.drawnCards.push(card);

    if (!(card.CardCode in this.decklist)) {
      return;
    }
    console.log(this.decklist);

    console.log(`DRAW ONE ${card.CardCode}`);

    this.decklist[card.CardCode]--;

    console.log(this.decklist);

    // TODO: ipcRenderer: Update quantity of cards in deck
  }

  private updateHand(
    response: PositionalRectanglesResponse,
    rectangles: Array<CardPositionRectangle>
  ): void {
    if (rectangles.length === 0) {
      return;
    }

    this.checkForLeveledChampion(rectangles);

    let rectanglesInHand = rectangles.filter(
      (x) =>
        x.LocalPlayer &&
        (x.TopLeftY - x.Height <= 0 ||
          (x.Width / x.Height >= 0.68 && x.Width / x.Height <= 0.72))
    );

    this.cardsInHandTemp = rectanglesInHand.map((x) => {
      return {
        CardCode: x.CardCode,
        CardID: x.CardID,
        LocalPlayer: x.LocalPlayer,
        RoundAddedToHand: null,
        wasDrawn: this.drawnCards.some((y) => y.CardID === x.CardID),
      };
    });

    console.log(rectangles);

    rectangles
      .filter(
        (x) =>
          x.LocalPlayer &&
          x.TopLeftY - x.Height > response.Screen.ScreenHeight * 0.2
      )
      .map((x) => x.CardID)
      .forEach((x) => this.cardIdsPendingPlay.add(x));

    console.log(this.cardIdsPendingPlay);

    if (
      rectanglesInHand.length > 0 &&
      rectanglesInHand.some((x) => x.TopLeftY < 0)
    ) {
      console.log("CHAMPION LEVELING");
      console.log("CHAMPION LEVELING");
      console.log("CHAMPION LEVELING");
      console.log("CHAMPION LEVELING");
      console.log("CHAMPION LEVELING");
      this.champLevelingRectangles = rectangles;
    }
  }

  private checkForLeveledChampion(rectangles: Array<CardPositionRectangle>) {
    // Run through special Level up conditions
    for (let rectangle of rectangles) {
      this.checkForJinxLevel(rectangle);
    }

    if (this.champLevelingRectangles.length > 0) {
      return;
    }

    let newRectangles = rectangles.filter(
      (x) =>
        !this.champLevelingRectangles.some((y) => y.CardID === x.CardID) &&
        x.LocalPlayer &&
        setJsonObject[x.CardCode].supertype.length > 0
    );

    console.log("NEW RECTANGLES");
    console.log(newRectangles);

    this.champLevelingRectangles = [];

    for (let leveledChamp of newRectangles) {
      if (!(leveledChamp.CardCode in this.championRoundLeveledUp)) {
        continue;
      }

      if (this.championRoundLeveledUp[leveledChamp.CardCode] > 0) {
        continue;
      }

      console.log("LEVELLED CHAMP");
      console.log(setJsonObject[leveledChamp.CardCode]);

      this.championRoundLeveledUp[leveledChamp.CardCode] = this.roundNumber;
    }
  }

  private checkForJinxLevel(rectangle: CardPositionRectangle) {
    if (!rectangle.LocalPlayer) {
      return;
    }

    if (rectangle.CardCode !== "01PZ040T2") {
      return;
    }

    if (!("01PZ040" in this.championRoundLeveledUp)) {
      return;
    }

    if (this.championRoundLeveledUp["01PZ040"] > 0) {
      return;
    }

    this.championRoundLeveledUp["01PZ040"] = this.roundNumber;
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
        playedCards: [],
      });

      this.timeline.opponent.push({
        roundNumber: this.roundNumber,
        playedCards: [],
      });
    }

    this.addTempToTimeline(isNewRound);
  }

  private addTempToTimeline(isNewRound: boolean) {
    let selfTimelineThisRoundCards = this.timeline.self.find(
      (x) => x.roundNumber === this.roundNumber
    )?.playedCards as Array<LocalCard>;

    for (let card of this.cardsPlayedThisRoundSelf) {
      selfTimelineThisRoundCards.push(card);
    }

    for (let card of this.cardsPlayedThisRoundOpponent) {
      this.timeline.opponent
        .find((x) => x.roundNumber === this.roundNumber)
        ?.playedCards.push(card);
    }

    this.cardsPlayedThisRoundSelf = [];
    this.cardsPlayedThisRoundOpponent = [];

    for (let card of this.timeline.self.find(
      (x) => x.roundNumber === this.roundNumber
    )?.playedCards as Array<LocalCard>) {
      console.log(card.RoundAddedToHand);
      if (card.RoundAddedToHand === null) {
        console.log(card);
        card.RoundAddedToHand = this.roundNumber;
        console.log(card);
      }
    }

    if (this.roundNumber <= 1) {
      return;
    }

    for (let card of this.timeline.self.find(
      (x) => x.roundNumber === this.roundNumber - 1
    )?.playedCards as Array<LocalCard>) {
      console.log("PREVIOUS ROUND");
      console.log(card.RoundAddedToHand);
      if (card.RoundAddedToHand === null) {
        console.log(card);
        card.RoundAddedToHand = this.roundNumber - 1;
        console.log(card);
      }
    }
  }

  private addCardsToTimeline(cards: Array<Card | LocalCard>) {
    if (this.isCheckingRound) {
      return this.addCardsToTempTimeline(cards);
    }

    for (let card of cards) {
      this.timeline[card.LocalPlayer ? "self" : "opponent"]
        .find((x) => x.roundNumber === this.roundNumber)
        ?.playedCards.push(card);
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
