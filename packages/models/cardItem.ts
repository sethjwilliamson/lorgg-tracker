import { DataTypes, Model } from "sequelize";
import { getSequelizeInstance } from "./sequelize";

const sequelize = getSequelizeInstance();

export class CardItem extends Model {
  declare id: number;
  declare cardCode: string;
  declare region: string;
  declare type: string;
  declare attack: number;
  declare health: number;
  declare cost: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CardItem.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    cardCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attack: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    health: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CardItem",
    underscored: true,
  }
);

CardItem.sync({ alter: true });
