import { Model } from "sequelize";

export class Deck extends Model {
  declare id: number;
  declare deckCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}
