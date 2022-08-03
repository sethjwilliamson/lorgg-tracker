import axios, { AxiosError, AxiosResponse } from "axios";
import { Context } from "./context";
import { StateLorClosed } from "./state-lor-closed";
import Store from "electron-store";

type LocalApiEndpoint =
  | "static-decklist"
  | "positional-rectangles"
  | "game-result";

export type StaticDecklistResponse = {
  DeckCode: string | null;
  CardsInDeck: { [key: string]: number } | null;
};

export type CardPositionRectangle = {
  CardID: number;
  CardCode: string;
  TopLeftX: number;
  TopLeftY: number;
  Width: number;
  Height: number;
  LocalPlayer: Boolean;
};

export type Card = {
  CardCode: string;
  CardID: number;
  LocalPlayer: Boolean;
};

export interface LocalCard extends Card {
  RoundAddedToHand: number | null;
  wasDrawn: Boolean;
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
  LocalPlayerWon: Boolean;
};

export type LocalApiResponse =
  | StaticDecklistResponse
  | PositionalRectanglesResponse
  | GameResultResponse;

export abstract class State {
  protected context!: Context;
  protected lorPort: string = "21337";
  protected store: Store;
  protected mulliganCards!: Array<LocalCard>;
  protected startingCards!: Array<LocalCard>;
  protected previousRectangles: string = "";

  constructor(prevState?: State) {
    if (!prevState) {
      this.store = new Store();
      return;
    }

    this.context = prevState.context;
    this.lorPort = prevState.lorPort;
    this.store = prevState.store;
    this.mulliganCards = prevState.mulliganCards;
    this.startingCards = prevState.startingCards;
    this.previousRectangles = prevState.previousRectangles;
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
