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
} from "sequelize";
import { CardItem } from "./cardItem";
import { TrackerMatchInfo } from "./trackerMatchInfo";

export class Timeline extends Model<
  InferAttributes<Timeline>,
  InferCreationAttributes<Timeline>
> {
  declare id: number;
  declare roundAddedToHand: number;
  declare roundPlayed: number | null;
  declare wasDrawn: boolean;
  declare wasInMulligan: boolean;
  declare wasKeptInMulligan: boolean | null;
  declare cardItemId: ForeignKey<CardItem["id"]>;
  declare trackerMatchInfoId: ForeignKey<TrackerMatchInfo["id"]>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getTrackerMatchInfos: BelongsToManyGetAssociationsMixin<TrackerMatchInfo>; // Note the null assertions!
  declare addTrackerMatchInfo: BelongsToManyAddAssociationMixin<
    TrackerMatchInfo,
    number
  >;
  declare addTrackerMatchInfos: BelongsToManyAddAssociationsMixin<
    TrackerMatchInfo,
    number
  >;
  declare setTrackerMatchInfos: BelongsToManySetAssociationsMixin<
    TrackerMatchInfo,
    number
  >;
  declare removeTrackerMatchInfo: BelongsToManyRemoveAssociationMixin<
    TrackerMatchInfo,
    number
  >;
  declare removeTrackerMatchInfos: BelongsToManyRemoveAssociationsMixin<
    TrackerMatchInfo,
    number
  >;
  declare hasTrackerMatchInfo: BelongsToManyHasAssociationMixin<
    TrackerMatchInfo,
    number
  >;
  declare hasTrackerMatchInfos: BelongsToManyHasAssociationsMixin<
    TrackerMatchInfo,
    number
  >;
  declare countTrackerMatchInfos: BelongsToManyCountAssociationsMixin;
  declare createTrackerMatchInfo: BelongsToManyCreateAssociationMixin<TrackerMatchInfo>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare trackerMatchInfos?: NonAttribute<TrackerMatchInfo[]>; // Note this is optional since it's only populated when explicitly requested in code

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getCardItems: BelongsToManyGetAssociationsMixin<CardItem>; // Note the null assertions!
  declare addCardItem: BelongsToManyAddAssociationMixin<CardItem, number>;
  declare addCardItems: BelongsToManyAddAssociationsMixin<CardItem, number>;
  declare setCardItems: BelongsToManySetAssociationsMixin<CardItem, number>;
  declare removeCardItem: BelongsToManyRemoveAssociationMixin<CardItem, number>;
  declare removeCardItems: BelongsToManyRemoveAssociationsMixin<
    CardItem,
    number
  >;
  declare hasCardItem: BelongsToManyHasAssociationMixin<CardItem, number>;
  declare hasCardItems: BelongsToManyHasAssociationsMixin<CardItem, number>;
  declare countCardItems: BelongsToManyCountAssociationsMixin;
  declare createCardItem: BelongsToManyCreateAssociationMixin<CardItem>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare cardItems?: NonAttribute<CardItem[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    trackerMatchInfos: Association<TrackerMatchInfo, Timeline>;
    cardItems: Association<CardItem, Timeline>;
  };
}
