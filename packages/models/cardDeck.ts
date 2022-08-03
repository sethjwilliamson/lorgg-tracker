import { Model } from "sequelize";

export class CardDeck extends Model {
  declare id: number;
  declare quantity: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}
