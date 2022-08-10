import { Sequelize, DataTypes } from "sequelize";
import electron from "electron";
import { Timeline } from "./timeline";
import { Archetype } from "./archetype";
import { ArchetypeTag } from "./archetypeTag";
import { CardDeck } from "./cardDeck";
import { CardItem } from "./cardItem";
import { Deck } from "./deck";
import { TrackerMatchInfo } from "./trackerMatchInfo";
import { MatchItem } from "./matchItem";
import { MatchPlayer } from "./matchPlayer";
import { User } from "./user";
import { createSampleData } from "./createSampleData";

init();

async function init() {
  let path =
    (await electron.ipcRenderer?.invoke("read-user-data")) ||
    electron.app.getPath("userData");
  console.log(path);
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path + "/databases/database.sqlite",
  });

  ArchetypeTag.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:
          "archetype_tags_tag_operator_value_quantity_archetype_id_unique",
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:
          "archetype_tags_tag_operator_value_quantity_archetype_id_unique",
      },
      quantity: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        unique:
          "archetype_tags_tag_operator_value_quantity_archetype_id_unique",
      },
      operator: {
        type: DataTypes.CHAR,
        allowNull: true,
        unique:
          "archetype_tags_tag_operator_value_quantity_archetype_id_unique",
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      // TODO: Add the unique value to archetype_id
    },
    {
      sequelize,
      modelName: "ArchetypeTag",
      underscored: true,
    }
  );

  Archetype.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Archetype",
      underscored: true,
    }
  );

  TrackerMatchInfo.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      roundGameEnded: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TrackerMatchInfo",
      underscored: true,
      timestamps: false,
    }
  );

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

  User.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "users_display_name_tag_line_server_index",
      },
      tagLine: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "users_display_name_tag_line_server_index",
      },
      server: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "users_display_name_tag_line_server_index",
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      underscored: true,
    }
  );

  MatchPlayer.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      isVictory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      isFirst: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "MatchPlayer",
      underscored: true,
    }
  );

  MatchItem.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      riotMatchId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      gameMode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gameType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      server: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startedAt: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "MatchItem",
      underscored: true,
    }
  );

  Deck.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      deckCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Deck",
      underscored: true,
    }
  );

  CardItem.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      cardCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      attack: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      health: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      cost: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "CardItem",
      underscored: true,
    }
  );

  CardDeck.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        unique: "card_decks_quantity_deck_id_card_item_id_unique",
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      // TODO: Add the unique value to deck_id and card_item_id
    },
    {
      sequelize,
      timestamps: false,
      modelName: "CardDeck",
      underscored: true,
    }
  );

  ArchetypeTag.belongsTo(Archetype);
  Archetype.hasMany(ArchetypeTag);

  Deck.belongsTo(Archetype);
  Archetype.hasMany(Deck);

  CardDeck.belongsTo(Deck);
  CardDeck.belongsTo(CardItem);
  Deck.hasMany(CardDeck);
  CardItem.hasMany(CardDeck);

  MatchPlayer.belongsTo(MatchItem);
  MatchItem.hasMany(MatchPlayer);

  MatchPlayer.belongsTo(Deck);
  Deck.hasMany(MatchPlayer);

  MatchPlayer.belongsTo(User);
  User.hasMany(MatchPlayer);

  TrackerMatchInfo.belongsTo(MatchPlayer);
  MatchPlayer.hasOne(TrackerMatchInfo);

  Timeline.belongsTo(TrackerMatchInfo);
  TrackerMatchInfo.hasMany(Timeline);
  Timeline.belongsTo(CardItem);
  CardItem.hasMany(Timeline);

  sequelize
    .sync({ force: true })
    .then((response) => {
      let user = User.build({
        displayName: "test2",
        tagLine: "test2",
        server: "test2",
      });

      console.log(user);

      user.save();
      console.log(response);

      createSampleData();
    })
    .catch((e: Error) => {
      console.error(e);
    });
}

export { User };
