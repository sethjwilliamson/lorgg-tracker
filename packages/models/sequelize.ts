import { app } from "electron";
import { Sequelize } from "sequelize";

import "./user";
import "./matchItem";
import "./matchPlayer";

export function getSequelizeInstance(): Sequelize {
  return new Sequelize({
    dialect: "sqlite",
    storage: app.getPath("userData") + "/databases/database.sqlite",
  });
}