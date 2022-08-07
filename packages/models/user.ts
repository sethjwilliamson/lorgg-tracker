import {
  Association,
  CreationOptional,
  DataTypes,
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
  Sequelize,
} from "sequelize";
import { MatchPlayer } from "./matchPlayer";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare displayName: string;
  declare tagLine: string;
  declare server: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

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
    "userId"
  >;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare matchPlayers?: NonAttribute<MatchPlayer[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    matchPlayers: Association<User, MatchPlayer>;
  };
}
