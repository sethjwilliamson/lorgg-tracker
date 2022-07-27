import { DataTypes, Model } from "sequelize";
import { getSequelizeInstance } from "./sequelize";

const sequelize = getSequelizeInstance();

export class ArchetypeTag extends Model {
  declare id: number;
  declare tag: string;
  declare value: string;
  declare quantity: number;
  declare operator: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ArchetypeTag.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "archetype_tags_tag_operator_value_quantity_archetype_id_unique",
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "archetype_tags_tag_operator_value_quantity_archetype_id_unique",
    },
    quantity: {
      type: DataTypes.NUMBER,
      allowNull: true,
      unique: "archetype_tags_tag_operator_value_quantity_archetype_id_unique",
    },
    operator: {
      type: DataTypes.CHAR,
      allowNull: true,
      unique: "archetype_tags_tag_operator_value_quantity_archetype_id_unique",
    },
    // TODO: Add the unique value to archetype_id
  },
  {
    sequelize,
    modelName: "ArchetypeTag",
    underscored: true,
  }
);

ArchetypeTag.sync({ alter: true });
