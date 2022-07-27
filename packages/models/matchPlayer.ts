import { DataTypes, Model } from "sequelize";
import { getSequelizeInstance } from "./sequelize";

const sequelize = getSequelizeInstance();

export class MatchPlayer extends Model {
  declare id: number;
  declare isVictory: boolean;
  declare isFirst: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

MatchPlayer.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    isVictory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isFirst: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "MatchPlayer",
    underscored: true,
  }
);

MatchPlayer.sync({ alter: true });