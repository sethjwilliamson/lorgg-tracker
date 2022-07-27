import { DataTypes, Model } from "sequelize";
import { getSequelizeInstance } from "./sequelize";

const sequelize = getSequelizeInstance();

export class Archetype extends Model {
  declare id: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Archetype.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "Archetype",
    underscored: true,
  }
);

Archetype.sync({ alter: true });
