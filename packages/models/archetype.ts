import { Model } from "sequelize";

export class Archetype extends Model {
  declare id: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}
