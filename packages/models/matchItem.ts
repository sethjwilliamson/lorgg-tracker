import { compileScript } from "@vue/compiler-sfc";
import { app } from "electron";
import { DataTypes, Model } from "sequelize";
import { getSequelizeInstance } from "./sequelize";

const sequelize = getSequelizeInstance();

export class MatchItem extends Model {
  declare id: number;
  declare riotMatchId: string | null;
  declare gameMode: string;
  declare gameType: string;
  declare server: string;
  declare startedAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

MatchItem.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    riotMatchId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    gameMode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gameType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    server: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startedAt: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "MatchItem",
    underscored: true,
  }
);

MatchItem.sync({ alter: true });
