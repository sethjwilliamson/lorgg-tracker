import electron, { ipcRenderer } from "electron";
import { Context } from "./game-state-tracking/context";
import { StateLorClosed } from "./game-state-tracking/state-lor-closed";

const context: Context = new Context(new StateLorClosed());
console.log(context);

setInterval(() => {
  context.onCall();
}, 1000);
