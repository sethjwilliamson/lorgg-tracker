import { DataTypes, Model } from "sequelize";
import { getSequelizeInstance } from "./sequelize";

const sequelize = getSequelizeInstance();

export class CardDeck extends Model {
  declare id: number;
  declare quantity: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CardDeck.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      unique: "card_decks_quantity_deck_id_card_item_id_unique",
    },
    // TODO: Add the unique value to deck_id and card_item_id
  },
  {
    sequelize,
    modelName: "CardDeck",
    underscored: true,
  }
);

CardDeck.sync({ alter: true });
