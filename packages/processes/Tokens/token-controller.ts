import { Request } from "express";
import express from "express";
import { ipcMain } from "electron";
import cors from "cors";
import { Server } from "http";
import Store from "electron-store";

const store = new Store();

const expressApp = express();

interface ReceiveTokenQueryTypes {
  token: string;
}

var corsOptions = {
  credentials: true,
  origin: ["http://lorgg.test", "https://lor.gg"],
};

expressApp.use(cors(corsOptions));

ipcMain.on("login", (event) => {
  require("electron").shell.openExternal(
    "https://lor.gg/tracker-authentication"
  );

  var expressListener: Server;

  expressApp.get(
    "/receive-token",
    (req: Request<unknown, unknown, unknown, ReceiveTokenQueryTypes>) => {
      console.log("Token Received");

      store.set("token", req.query.token);

      expressListener.close(() => console.log("Listener Closed"));

      return event.reply("token-received");
    }
  );

  expressListener = expressApp.listen(5674, "0.0.0.0", () =>
    console.log("Listening on Port 5674")
  );
});

ipcMain.on("logout", (event) => {
  store.delete("token");

  console.log("Token Removed");

  return event.reply("token-revoked");
});
