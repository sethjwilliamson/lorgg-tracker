import { Model } from "sequelize";

export class TrackerMatchInfo extends Model {
  declare id: number;
  declare roundGameEnded: number;
}
