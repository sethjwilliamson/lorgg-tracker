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
import { Deck } from "./deck";

export class CardDeck extends Model<
  InferAttributes<CardDeck>,
  InferCreationAttributes<CardDeck>
> {
  declare id: number;
  declare quantity: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare cardItemId: ForeignKey<CardItem["id"]>;
  declare deckId: ForeignKey<Deck["id"]>;

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
    decks: Association<CardDeck, Deck>;
    cardItems: Association<CardDeck, CardItem>;
  };
}
