import { AxiosResponse } from "axios";
import { LocalApiResponse, PositionalRectanglesResponse, State } from "./state";
import { StateMenus } from "./state-menus";

export class StateInGame extends State {
  public afterStateChange() {}

  public handle() {}

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
}
