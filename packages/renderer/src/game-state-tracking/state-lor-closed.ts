import { AxiosResponse } from "axios";
import { LocalApiResponse, PositionalRectanglesResponse, State } from "./state";
import { StateInGame } from "./state-in-game";
import { StateMenus } from "./state-menus";

export class StateLorClosed extends State {
  public afterStateChange() {}

  public handle() {}

  public checkForStateChange() {
    this.callLocalApiEndpoint("positional-rectangles").then(
      (response: AxiosResponse<LocalApiResponse>) => {
        const { data } =
          response as AxiosResponse<PositionalRectanglesResponse>;

        if (data.GameState === "Menus") {
          this.context.transitionTo(new StateMenus());
        } else if (data.GameState === "InProgress") {
          this.context.transitionTo(new StateInGame(this));
        }
      }
    );
  }

  public beforeStateChange() {}
}
