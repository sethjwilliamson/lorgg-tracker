import {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  Association,
  NonAttribute,
} from "sequelize";
import { Archetype } from "./archetype";

export class ArchetypeTag extends Model<
  InferAttributes<ArchetypeTag>,
  InferCreationAttributes<ArchetypeTag>
> {
  declare id: number;
  declare tag: string;
  declare value: string;
  declare quantity: number | null;
  declare operator: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare archetypeId: ForeignKey<Archetype["id"]>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getArchetype: BelongsToGetAssociationMixin<Archetype>; // Note the null assertions!
  declare setArchetype: BelongsToSetAssociationMixin<Archetype, number>;
  declare createArchetype: BelongsToCreateAssociationMixin<Archetype>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare archetypes?: NonAttribute<Archetype[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    archetypes: Association<Archetype, ArchetypeTag>;
  };
}
