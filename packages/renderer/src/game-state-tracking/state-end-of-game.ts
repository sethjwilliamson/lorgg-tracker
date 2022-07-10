import axios from "axios";
import dayjs from "dayjs";
import { ipcRenderer } from "electron";
import { State } from "./state";

export class StateEndOfGame extends State {
  public afterStateChange() {}

  public handle() {}

  public checkForStateChange() {}

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

        ipcRenderer.send("cross-renderer-comm", "match-history-refreshed");
      });
  }
}
