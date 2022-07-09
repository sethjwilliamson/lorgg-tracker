import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
const Store = require("electron-store");
const store = new Store();

app.on("ready", () => {
  const updateServer = "hazel-z8ruew1oy-sethjwilliamson.vercel.app";
  const url = `https://${updateServer}/update/${
    process.platform
  }/${app.getVersion()}`;

  autoUpdater.logger = require("electron-log");

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("checking-for-update", () => {
    console.log("Checking For Update");
  });

  autoUpdater.on("update-available", () => {
    console.log("Update Available");
  });

  autoUpdater.on("update-not-available", () => {
    console.log("Update Not Available");
  });

  autoUpdater.on("update-downloaded", () => {
    console.log("Quitting and Installing");

    autoUpdater.quitAndInstall();
  });
});
