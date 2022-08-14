import axios, { AxiosError, AxiosResponse } from "axios";
import { Context } from "./context";
import { StateLorClosed } from "./state-lor-closed";
import Store from "electron-store";
import dayjs, { Dayjs } from "dayjs";

type LocalApiEndpoint =
  | "static-decklist"
  | "positional-rectangles"
  | "game-result";

export type CardsInDeck = { [key: string]: number };
export type ChampionRoundLeveledUp = { [key: string]: number };

export type StaticDecklistResponse = {
  DeckCode: string | null;
  CardsInDeck: CardsInDeck | null;
};

export type CardPositionRectangle = {
  CardID: number;
  CardCode: string;
  TopLeftX: number;
  TopLeftY: number;
  Width: number;
  Height: number;
  LocalPlayer: boolean;
};

export type Card = {
  CardCode: string;
  CardID: number;
  LocalPlayer: boolean;
};

export interface LocalCard extends Card {
  RoundAddedToHand: number | null;
  wasDrawn: boolean;
}

export type PositionalRectanglesResponse = {
  PlayerName: string | null;
  OpponentName: string | null;
  GameState: "Menus" | "InProgress";
  Screen: {
    ScreenWidth: number;
    ScreenHeight: number;
  };
  Rectangles: Array<CardPositionRectangle>;
};

export type GameResultResponse = {
  GameID: number;
  LocalPlayerWon: boolean;
};

export type LocalApiResponse =
  | StaticDecklistResponse
  | PositionalRectanglesResponse
  | GameResultResponse;

type Timeline = {
  self: Array<{
    roundNumber: number;
    playedCards: Array<LocalCard>;
  }>;
  opponent: Array<{
    roundNumber: number;
    playedCards: Array<Card>;
  }>;
};

export type ExportData = {
  mulliganCards: Array<LocalCard>;
  startingCards: Array<LocalCard>;
  timeline: Timeline;
  roundNumber: number;
  cardsInHand: Array<LocalCard>;
  championRoundLeveledUp: ChampionRoundLeveledUp;
  endTime: Date;
};

export abstract class State {
  protected context!: Context;
  protected lorPort: string = "21337";
  protected store: Store;
  public mulliganCards: Array<LocalCard> = [];
  public startingCards: Array<LocalCard> = [];
  protected previousRectangles: string = "";
  protected deckCode: string | null = null;
  protected startTime: Dayjs | null = null;
  protected opponentName: string | null = null;
  public timeline: Timeline = {
    self: [],
    opponent: [],
  };
  public roundNumber: number = 0;
  public cardsInHand: Array<LocalCard> = [];
  public championRoundLeveledUp: ChampionRoundLeveledUp = {};
  public endTime: Dayjs | null = null;

  constructor(prevState?: State) {
    if (!prevState) {
      this.store = new Store();
      return;
    }

    console.log("CONSTRUCTOR");
    console.log(prevState);

    this.context = prevState.context;
    this.lorPort = prevState.lorPort;
    this.store = prevState.store;
    this.mulliganCards = prevState.mulliganCards;
    this.startingCards = prevState.startingCards;
    this.previousRectangles = prevState.previousRectangles;
    this.deckCode = prevState.deckCode;
    this.startTime = prevState.startTime;
    this.opponentName = prevState.opponentName;
    this.timeline = prevState.timeline;
    this.roundNumber = prevState.roundNumber;
    this.cardsInHand = prevState.cardsInHand;
    this.championRoundLeveledUp = prevState.championRoundLeveledUp;
    this.endTime = prevState.endTime;
    console.log(this);
  }

  public setContext(context: Context) {
    this.context = context;
  }

  public setLorPort(lorPort: string) {
    this.lorPort = lorPort;
  }

  public abstract afterStateChange(): void;

  public abstract handle(): void;

  public abstract checkForStateChange(): void;

  public abstract beforeStateChange(): void;

  protected callLocalApiEndpoint(
    endpoint: LocalApiEndpoint
  ): Promise<AxiosResponse<LocalApiResponse>> {
    let fetchPromise: Promise<AxiosResponse<LocalApiResponse>> = axios.get(
      `http://localhost:${this.lorPort}/${endpoint}`,
      {
        //timeout: 500,
      }
    );

    fetchPromise.catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK" && !(this instanceof StateLorClosed)) {
        this.context.transitionTo(new StateLorClosed());
      }
    });

    return fetchPromise;
  }

  protected shouldSkipRectangles(data: Array<CardPositionRectangle>): Boolean {
    let temp: string = this.previousRectangles;
    this.previousRectangles = JSON.stringify(data);

    return temp === this.previousRectangles;
  }
}
