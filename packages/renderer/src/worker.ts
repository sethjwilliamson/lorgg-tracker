import electron, { ipcRenderer } from "electron";
import { Context } from "./game-state-tracking/context";
import { StateLorClosed } from "./game-state-tracking/state-lor-closed";
// import { db } from "../../models";
import dayjs from "dayjs";
import { User } from "../../models";

// let users = await db.User.findAll();
// // User.findAll()
// console.log("users");
// console.log(users);

setTimeout(() => {
  let user = User.build({
    displayName: "test",
    tagLine: "test",
    server: "test",
  });

  console.log(user);

  user.save();
}, 5000);

// console.log("users");
// console.log(users);

const context: Context = new Context(new StateLorClosed());
console.log(context);

setInterval(() => {
  context.onCall();
}, 1000);
