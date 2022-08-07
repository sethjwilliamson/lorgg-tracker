import {
  Association,
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
  ForeignKey,
} from "sequelize";
import { MatchPlayer } from "./matchPlayer";
import { Timeline } from "./timeline";

export class TrackerMatchInfo extends Model<
  InferAttributes<TrackerMatchInfo>,
  InferCreationAttributes<TrackerMatchInfo>
> {
  declare id: number;
  declare roundGameEnded: number;

  declare matchPlayerId: ForeignKey<MatchPlayer["id"]>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getTimelines: HasManyGetAssociationsMixin<Timeline>; // Note the null assertions!
  declare addTimeline: HasManyAddAssociationMixin<Timeline, number>;
  declare addTimelines: HasManyAddAssociationsMixin<Timeline, number>;
  declare setTimelines: HasManySetAssociationsMixin<Timeline, number>;
  declare removeTimeline: HasManyRemoveAssociationMixin<Timeline, number>;
  declare removeTimelines: HasManyRemoveAssociationsMixin<Timeline, number>;
  declare hasTimeline: HasManyHasAssociationMixin<Timeline, number>;
  declare hasTimelines: HasManyHasAssociationsMixin<Timeline, number>;
  declare countTimelines: HasManyCountAssociationsMixin;
  declare createTimeline: HasManyCreateAssociationMixin<
    Timeline,
    "trackerMatchInfoId"
  >;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare timelines?: NonAttribute<Timeline[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare getMatchPlayers: HasManyGetAssociationsMixin<MatchPlayer>; // Note the null assertions!
  declare setMatchPlayers: HasManySetAssociationsMixin<MatchPlayer, number>;
  declare createMatchPlayer: HasManyCreateAssociationMixin<MatchPlayer, "id">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare matchPlayer?: NonAttribute<MatchPlayer>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    timelines: Association<TrackerMatchInfo, Timeline>;
    matchPlayer: Association<MatchPlayer, TrackerMatchInfo>;
  };
}
