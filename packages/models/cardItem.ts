import { Model } from "sequelize";

export class CardItem extends Model {
  declare id: number;
  declare cardCode: string;
  declare region: string;
  declare type: string;
  declare attack: number;
  declare health: number;
  declare cost: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}
