import { DataTypes, Model } from "sequelize";
import { getSequelizeInstance } from "./sequelize";

const sequelize = getSequelizeInstance();

export class TrackerMatchInfo extends Model {
  declare id: number;
  declare roundGameEnded: number;
}

TrackerMatchInfo.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    roundGameEnded: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TrackerMatchInfo",
    underscored: true,
    timestamps: false,
  }
);
