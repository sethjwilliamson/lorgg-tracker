import { compileScript } from "@vue/compiler-sfc";
import { app } from "electron";
import { DataTypes, Model } from "sequelize";
import { getSequelizeInstance } from "./sequelize";

const sequelize = getSequelizeInstance();

export class User extends Model {
  declare id: number;
  declare displayName: string;
  declare tagLine: string;
  declare server: string;
}

User.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "users_display_name_tag_line_server_index",
      field: "display_name",
    },
    tagLine: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "users_display_name_tag_line_server_index",
      field: "tag_line",
    },
    server: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "users_display_name_tag_line_server_index",
      field: "server",
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "User", // We need to choose the model name
  }
);

User.sync();
