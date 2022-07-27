import { app } from "electron";
import { Sequelize } from "sequelize";

import "./user";
import "./matchItem";
import "./matchPlayer";
import "./cardItem";
import "./archetype";
import "./archetypeTag";
import "./cardDeck";
import "./deck";
import "./timeline";
import "./associations";
import { User } from "./user";
import { MatchItem } from "./matchItem";
import { MatchPlayer } from "./matchPlayer";
import { CardItem } from "./cardItem";
import { Archetype } from "./archetype";
import { ArchetypeTag } from "./archetypeTag";
import { CardDeck } from "./cardDeck";
import { Deck } from "./deck";
import { Timeline } from "./timeline";

User.sync({ alter: true });
MatchItem.sync({ alter: true });
MatchPlayer.sync({ alter: true });
CardItem.sync({ alter: true });
Archetype.sync({ alter: true });
ArchetypeTag.sync({ alter: true });
CardDeck.sync({ alter: true });
Deck.sync({ alter: true });
Timeline.sync({ alter: true });

export function getSequelizeInstance(): Sequelize {
  return new Sequelize({
    dialect: "sqlite",
    storage: app.getPath("userData") + "/databases/database.sqlite",
  });
}
