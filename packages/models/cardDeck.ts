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
} from "sequelize";
import { CardItem } from "./cardItem";
import { Deck } from "./deck";

export class CardDeck extends Model<
  InferAttributes<CardDeck>,
  InferCreationAttributes<CardDeck>
> {
  declare id: CreationOptional<number>;
  declare quantity: number;

  declare cardItemId: CreationOptional<ForeignKey<CardItem["id"]>>;
  declare deckId: CreationOptional<ForeignKey<Deck["id"]>>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getDeck: BelongsToGetAssociationMixin<Deck>; // Note the null assertions!
  declare setDeck: BelongsToSetAssociationMixin<Deck, number>;
  declare createDeck: BelongsToCreateAssociationMixin<Deck>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare decks?: NonAttribute<Deck[]>; // Note this is optional since it's only populated when explicitly requested in code

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
    decks: Association<CardDeck, Deck>;
    cardItems: Association<CardDeck, CardItem>;
  };
}
