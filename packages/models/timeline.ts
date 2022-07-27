import { DataTypes, Model } from "sequelize";
import { getSequelizeInstance } from "./sequelize";

const sequelize = getSequelizeInstance();

export class Timeline extends Model {
  declare id: number;
  declare roundAddedToHand: number;
  declare roundPlayed: number;
  declare wasDrawn: boolean;
  declare wasInMulligan: boolean;
  declare wasKeptInMulligan: boolean;
}

Timeline.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    roundAddedToHand: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
    },
    roundPlayed: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
    },
    wasDrawn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    wasInMulligan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    wasKeptInMulligan: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Timeline",
    underscored: true,
    timestamps: false,
    validate: {
      // Validates that wasKeptInMulligan can only be null when wasInMulligan is false and cannot be null when wasInMulligan is true
      validateWasKeptInMulligan() {
        if (this.wasInMulligan && this.wasKeptInMulligan === null) {
          throw new Error(
            "wasKeptInMulligan cannot be null if wasInMulligan is true."
          );
        }

        if (!this.wasInMulligan && this.wasKeptInMulligan !== null) {
          throw new Error(
            "wasKeptInMulligan must be null if wasInMulligan is false."
          );
        }
      },
    },
  }
);
