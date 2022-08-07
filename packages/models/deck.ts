import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  ForeignKey,
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
import { Archetype } from "./archetype";
import { CardDeck } from "./cardDeck";
import { MatchPlayer } from "./matchPlayer";
import { User } from "./user";

export class Deck extends Model<
  InferAttributes<Deck>,
  InferCreationAttributes<Deck>
> {
  declare id: number;
  declare deckCode: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare userId: ForeignKey<User["id"]>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getCardDecks: HasManyGetAssociationsMixin<CardDeck>; // Note the null assertions!
  declare addCardDeck: HasManyAddAssociationMixin<CardDeck, number>;
  declare addCardDecks: HasManyAddAssociationsMixin<CardDeck, number>;
  declare setCardDecks: HasManySetAssociationsMixin<CardDeck, number>;
  declare removeCardDeck: HasManyRemoveAssociationMixin<CardDeck, number>;
  declare removeCardDecks: HasManyRemoveAssociationsMixin<CardDeck, number>;
  declare hasCardDeck: HasManyHasAssociationMixin<CardDeck, number>;
  declare hasCardDecks: HasManyHasAssociationsMixin<CardDeck, number>;
  declare countCardDecks: HasManyCountAssociationsMixin;
  declare createCardDeck: HasManyCreateAssociationMixin<CardDeck, "deckId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare CardDecks?: NonAttribute<CardDeck[]>; // Note this is optional since it's only populated when explicitly requested in code

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getMatchPlayers: HasManyGetAssociationsMixin<MatchPlayer>; // Note the null assertions!
  declare addMatchPlayer: HasManyAddAssociationMixin<MatchPlayer, number>;
  declare addMatchPlayers: HasManyAddAssociationsMixin<MatchPlayer, number>;
  declare setMatchPlayers: HasManySetAssociationsMixin<MatchPlayer, number>;
  declare removeMatchPlayer: HasManyRemoveAssociationMixin<MatchPlayer, number>;
  declare removeMatchPlayers: HasManyRemoveAssociationsMixin<
    MatchPlayer,
    number
  >;
  declare hasMatchPlayer: HasManyHasAssociationMixin<MatchPlayer, number>;
  declare hasMatchPlayers: HasManyHasAssociationsMixin<MatchPlayer, number>;
  declare countMatchPlayers: HasManyCountAssociationsMixin;
  declare createMatchPlayer: HasManyCreateAssociationMixin<
    MatchPlayer,
    "deckId"
  >;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare matchPlayers?: NonAttribute<MatchPlayer[]>; // Note this is optional since it's only populated when explicitly requested in code

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
    cardDecks: Association<Deck, CardDeck>;
    matchPlayers: Association<Deck, MatchPlayer>;
    archetypes: Association<Archetype, Deck>;
  };
}
