import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
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
  declare getTrackerMatchInfos: BelongsToGetAssociationMixin<TrackerMatchInfo>; // Note the null assertions!
  declare setTrackerMatchInfos: BelongsToSetAssociationMixin<
    TrackerMatchInfo,
    number
  >;
  declare createTrackerMatchInfo: BelongsToCreateAssociationMixin<TrackerMatchInfo>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare trackerMatchInfos?: NonAttribute<TrackerMatchInfo[]>; // Note this is optional since it's only populated when explicitly requested in code

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getCardItem: BelongsToGetAssociationMixin<CardItem>; // Note the null assertions!
  declare setCardItem: BelongsToSetAssociationMixin<CardItem, number>;
  declare createCardItem: BelongsToCreateAssociationMixin<CardItem>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare cardItems?: NonAttribute<CardItem[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    trackerMatchInfos: Association<TrackerMatchInfo, Timeline>;
    cardItems: Association<CardItem, Timeline>;
  };
}
