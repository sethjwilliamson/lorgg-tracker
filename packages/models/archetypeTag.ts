import {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
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
  declare getArchetypes: BelongsToManyGetAssociationsMixin<Archetype>; // Note the null assertions!
  declare addArchetype: BelongsToManyAddAssociationMixin<Archetype, number>;
  declare addArchetypes: BelongsToManyAddAssociationsMixin<Archetype, number>;
  declare setArchetypes: BelongsToManySetAssociationsMixin<Archetype, number>;
  declare removeArchetype: BelongsToManyRemoveAssociationMixin<
    Archetype,
    number
  >;
  declare removeArchetypes: BelongsToManyRemoveAssociationsMixin<
    Archetype,
    number
  >;
  declare hasArchetype: BelongsToManyHasAssociationMixin<Archetype, number>;
  declare hasArchetypes: BelongsToManyHasAssociationsMixin<Archetype, number>;
  declare countArchetypes: BelongsToManyCountAssociationsMixin;
  declare createArchetype: BelongsToManyCreateAssociationMixin<Archetype>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare archetypes?: NonAttribute<Archetype[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    archetypes: Association<Archetype, ArchetypeTag>;
  };
}
