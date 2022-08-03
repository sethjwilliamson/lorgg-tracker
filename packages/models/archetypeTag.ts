import { Model } from "sequelize";

export class ArchetypeTag extends Model {
  declare id: number;
  declare tag: string;
  declare value: string;
  declare quantity: number | null;
  declare operator: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}
