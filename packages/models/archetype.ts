import {
  Association,
  CreationOptional,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { ArchetypeTag } from "./archetypeTag";
import { Deck } from "./deck";

export class Archetype extends Model<
  InferAttributes<Archetype>,
  InferCreationAttributes<Archetype>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getArchetypeTags: HasManyGetAssociationsMixin<ArchetypeTag>; // Note the null assertions!
  declare addArchetypeTag: HasManyAddAssociationMixin<ArchetypeTag, number>;
  declare addArchetypeTags: HasManyAddAssociationsMixin<ArchetypeTag, number>;
  declare setArchetypeTags: HasManySetAssociationsMixin<ArchetypeTag, number>;
  declare removeArchetypeTag: HasManyRemoveAssociationMixin<
    ArchetypeTag,
    number
  >;
  declare removeArchetypeTags: HasManyRemoveAssociationsMixin<
    ArchetypeTag,
    number
  >;
  declare hasArchetypeTag: HasManyHasAssociationMixin<ArchetypeTag, number>;
  declare hasArchetypeTags: HasManyHasAssociationsMixin<ArchetypeTag, number>;
  declare countArchetypeTags: HasManyCountAssociationsMixin;
  declare createArchetypeTag: HasManyCreateAssociationMixin<
    ArchetypeTag,
    "archetypeId"
  >;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getDecks: HasManyGetAssociationsMixin<Deck>; // Note the null assertions!
  declare addDeck: HasManyAddAssociationMixin<Deck, number>;
  declare addDecks: HasManyAddAssociationsMixin<Deck, number>;
  declare setDecks: HasManySetAssociationsMixin<Deck, number>;
  declare removeDeck: HasManyRemoveAssociationMixin<Deck, number>;
  declare removeDecks: HasManyRemoveAssociationsMixin<Deck, number>;
  declare hasDeck: HasManyHasAssociationMixin<Deck, number>;
  declare hasDecks: HasManyHasAssociationsMixin<Deck, number>;
  declare countDecks: HasManyCountAssociationsMixin;
  declare createDeck: HasManyCreateAssociationMixin<Deck, "userId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare Decks?: NonAttribute<Deck[]>; // Note this is optional since it's only populated when explicitly requested in code

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare ArchetypeTags?: NonAttribute<ArchetypeTag[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    archetypeTags: Association<Archetype, ArchetypeTag>;
    decks: Association<Archetype, Deck>;
  };
}
