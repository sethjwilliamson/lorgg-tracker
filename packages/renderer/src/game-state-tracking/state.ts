import axios, { AxiosError, AxiosResponse } from "axios";
import { Context } from "./context";
import { StateLorClosed } from "./state-lor-closed";

type LocalApiEndpoint =
  | "static-decklist"
  | "positional-rectangles"
  | "game-result";

export type StaticDecklistResponse = {
  DeckCode: String | null;
  // Object maybe can be changed to Deck from lor-deckcodes-ts
  CardsInDeck: Object | null;
};

type CardPositionRectangle = {
  CardID: Number;
  CardCode: String;
  TopLeftX: Number;
  TopLeftY: Number;
  Width: Number;
  Height: Number;
  LocalPlayer: Boolean;
};

export type PositionalRectanglesResponse = {
  PlayerName: String | null;
  OpponentName: String | null;
  GameState: "Menus" | "InProgress";
  Screen: {
    ScreenWidth: Number;
    ScreenHeight: Number;
  };
  Rectangles: Array<CardPositionRectangle>;
};

export type GameResultResponse = {
  GameID: Number;
  LocalPlayerWon: Boolean;
};

export type LocalApiResponse =
  | StaticDecklistResponse
  | PositionalRectanglesResponse
  | GameResultResponse;

export abstract class State {
  protected context!: Context;
  protected lorPort: string = "21337";

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
        timeout: 500,
      }
    );

    fetchPromise.catch((error: AxiosError) => {
      if (error.code === "ERR_NETWORK" && !(this instanceof StateLorClosed)) {
        this.context.transitionTo(new StateLorClosed());
      }
    });

    return fetchPromise;
  }
}
