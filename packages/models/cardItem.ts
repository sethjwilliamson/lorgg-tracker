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
import { CardDeck } from "./cardDeck";
import { Timeline } from "./timeline";

export class CardItem extends Model<
  InferAttributes<CardItem>,
  InferCreationAttributes<CardItem>
> {
  declare id: CreationOptional<number>;
  declare cardCode: string;
  declare region: string;
  declare type: string;
  declare attack: number;
  declare health: number;
  declare cost: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

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
  declare createCardDeck: HasManyCreateAssociationMixin<CardDeck, "cardItemId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare CardDecks?: NonAttribute<CardDeck[]>; // Note this is optional since it's only populated when explicitly requested in code

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
  declare createTimeline: HasManyCreateAssociationMixin<Timeline, "cardItemId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare timelines?: NonAttribute<Timeline[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    cardDecks: Association<CardItem, CardDeck>;
    timelines: Association<Timeline, CardDeck>;
  };
}
