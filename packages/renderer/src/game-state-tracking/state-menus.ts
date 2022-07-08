import { AxiosResponse } from "axios";
import { LocalApiResponse, PositionalRectanglesResponse, State } from "./state";
import { StateInGame } from "./state-in-game";

export class StateMenus extends State {
  public afterStateChange() {}

  public handle() {}

  public checkForStateChange() {
    this.callLocalApiEndpoint("positional-rectangles").then(
      (response: AxiosResponse<LocalApiResponse>) => {
        const { data } =
          response as AxiosResponse<PositionalRectanglesResponse>;

        if (data.GameState === "InProgress") {
          this.context.transitionTo(new StateInGame());
        }
      }
    );
  }

  public beforeStateChange() {}
}
