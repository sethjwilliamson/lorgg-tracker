import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
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
  declare id: CreationOptional<number>;
  declare isVictory: boolean;
  declare isFirst: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare userId: CreationOptional<ForeignKey<User["id"]>>;
  declare matchItemId: CreationOptional<ForeignKey<MatchItem["id"]>>;
  declare deckId: CreationOptional<ForeignKey<Deck["id"]>>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getUser: BelongsToGetAssociationMixin<User>; // Note the null assertions!
  declare setUser: BelongsToSetAssociationMixin<User, number>;
  declare createUser: BelongsToCreateAssociationMixin<User>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare users?: NonAttribute<User[]>; // Note this is optional since it's only populated when explicitly requested in code

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getMatchItem: BelongsToGetAssociationMixin<MatchItem>; // Note the null assertions!
  declare setMatchItem: BelongsToSetAssociationMixin<MatchItem, number>;
  declare createMatchItem: BelongsToCreateAssociationMixin<MatchItem>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare matchItems?: NonAttribute<MatchItem[]>; // Note this is optional since it's only populated when explicitly requested in code

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getDeck: BelongsToGetAssociationMixin<Deck>; // Note the null assertions!
  declare setDeck: BelongsToSetAssociationMixin<Deck, number>;
  declare createDeck: BelongsToCreateAssociationMixin<Deck>;

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
