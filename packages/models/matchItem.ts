import { Model } from "sequelize";

export class MatchItem extends Model {
  declare id: number;
  declare riotMatchId: string | null;
  declare gameMode: string;
  declare gameType: string;
  declare server: string;
  declare startedAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}
