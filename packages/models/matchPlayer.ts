import {
  Association,
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
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from "sequelize";
import { Deck } from "./deck";
import { MatchItem } from "./matchItem";
import { TrackerMatchInfo } from "./trackerMatchInfo";
import { User } from "./user";

export class MatchPlayer extends Model<
  InferAttributes<MatchPlayer>,
  InferCreationAttributes<MatchPlayer>
> {
  declare id: number;
  declare isVictory: boolean;
  declare isFirst: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare userId: ForeignKey<User["id"]>;
  declare matchItemId: ForeignKey<MatchItem["id"]>;
  declare deckId: ForeignKey<Deck["id"]>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getUsers: BelongsToManyGetAssociationsMixin<User>; // Note the null assertions!
  declare addUser: BelongsToManyAddAssociationMixin<User, number>;
  declare addUsers: BelongsToManyAddAssociationsMixin<User, number>;
  declare setUsers: BelongsToManySetAssociationsMixin<User, number>;
  declare removeUser: BelongsToManyRemoveAssociationMixin<User, number>;
  declare removeUsers: BelongsToManyRemoveAssociationsMixin<User, number>;
  declare hasUser: BelongsToManyHasAssociationMixin<User, number>;
  declare hasUsers: BelongsToManyHasAssociationsMixin<User, number>;
  declare countUsers: BelongsToManyCountAssociationsMixin;
  declare createUser: BelongsToManyCreateAssociationMixin<User>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare users?: NonAttribute<User[]>; // Note this is optional since it's only populated when explicitly requested in code

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getMatchItems: BelongsToManyGetAssociationsMixin<MatchItem>; // Note the null assertions!
  declare addMatchItem: BelongsToManyAddAssociationMixin<MatchItem, number>;
  declare addMatchItems: BelongsToManyAddAssociationsMixin<MatchItem, number>;
  declare setMatchItems: BelongsToManySetAssociationsMixin<MatchItem, number>;
  declare removeMatchItem: BelongsToManyRemoveAssociationMixin<
    MatchItem,
    number
  >;
  declare removeMatchItems: BelongsToManyRemoveAssociationsMixin<
    MatchItem,
    number
  >;
  declare hasMatchItem: BelongsToManyHasAssociationMixin<MatchItem, number>;
  declare hasMatchItems: BelongsToManyHasAssociationsMixin<MatchItem, number>;
  declare countMatchItems: BelongsToManyCountAssociationsMixin;
  declare createMatchItem: BelongsToManyCreateAssociationMixin<MatchItem>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare matchItems?: NonAttribute<MatchItem[]>; // Note this is optional since it's only populated when explicitly requested in code

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getDecks: BelongsToManyGetAssociationsMixin<Deck>; // Note the null assertions!
  declare addDeck: BelongsToManyAddAssociationMixin<Deck, number>;
  declare addDecks: BelongsToManyAddAssociationsMixin<Deck, number>;
  declare setDecks: BelongsToManySetAssociationsMixin<Deck, number>;
  declare removeDeck: BelongsToManyRemoveAssociationMixin<Deck, number>;
  declare removeDecks: BelongsToManyRemoveAssociationsMixin<Deck, number>;
  declare hasDeck: BelongsToManyHasAssociationMixin<Deck, number>;
  declare hasDecks: BelongsToManyHasAssociationsMixin<Deck, number>;
  declare countDecks: BelongsToManyCountAssociationsMixin;
  declare createDeck: BelongsToManyCreateAssociationMixin<Deck>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare decks?: NonAttribute<Deck[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare createTrackerMatchInfo: HasOneCreateAssociationMixin<TrackerMatchInfo>;
  declare getTrackerMatchInfo: HasOneGetAssociationMixin<TrackerMatchInfo>;
  declare setTrackerMatchInfo: HasOneSetAssociationMixin<
    TrackerMatchInfo,
    "matchPlayerId"
  >;

  declare trackerMatchInfo?: NonAttribute<TrackerMatchInfo>;

  declare static associations: {
    decks: Association<MatchPlayer, Deck>;
    users: Association<MatchPlayer, User>;
    matchItems: Association<MatchPlayer, MatchItem>;
    trackerMatchInfo: Association<TrackerMatchInfo, MatchPlayer>;
  };
}
