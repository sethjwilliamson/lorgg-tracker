import axios, { AxiosResponse } from "axios";
import { LocalApiResponse, PositionalRectanglesResponse, State } from "./state";
import { StateMenus } from "./state-menus";
import dayjs from "dayjs";
import { ipcRenderer } from "electron";

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

  public beforeStateChange() {
    axios
      .post(
        "https://lor.gg/api/tokens/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${this.store.get("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);

        this.store.set("last-refresh", dayjs());

        ipcRenderer.send("match-history-refreshed");
      });
  }
}
