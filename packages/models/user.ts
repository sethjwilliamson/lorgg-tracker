import { DataTypes, Model, Sequelize } from "sequelize";

export class User extends Model {
  declare id: number;
  declare displayName: string;
  declare tagLine: string;
  declare server: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initializeTimeline(sequelize: Sequelize) {
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
    },
    {
      sequelize,
      modelName: "User",
      underscored: true,
    }
  );
}
