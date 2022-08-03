import { Model } from "sequelize";

export class Timeline extends Model {
  declare id: number;
  declare roundAddedToHand: number;
  declare roundPlayed: number | null;
  declare wasDrawn: boolean;
  declare wasInMulligan: boolean;
  declare wasKeptInMulligan: boolean | null;
}
