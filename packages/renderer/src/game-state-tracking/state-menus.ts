import { AxiosResponse } from "axios";
import { LocalApiResponse, PositionalRectanglesResponse, State } from "./state";
import { StateMulligan } from "./state-mulligan";

export class StateMenus extends State {
  public afterStateChange() {}

  public handle() {}

  public checkForStateChange() {
    this.callLocalApiEndpoint("positional-rectangles").then(
      (response: AxiosResponse<LocalApiResponse>) => {
        const { data } =
          response as AxiosResponse<PositionalRectanglesResponse>;

        if (data.GameState === "InProgress") {
          this.context.transitionTo(new StateMulligan(this));
        }
      }
    );
  }

  public beforeStateChange() {}
}
