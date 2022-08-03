import { Model } from "sequelize";

export class MatchPlayer extends Model {
  declare id: number;
  declare isVictory: boolean;
  declare isFirst: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}
