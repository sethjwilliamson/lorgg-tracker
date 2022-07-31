import { Archetype } from "./archetype";
import { ArchetypeTag } from "./archetypeTag";
import { CardDeck } from "./cardDeck";
import { CardItem } from "./cardItem";
import { Deck } from "./deck";
import { MatchItem } from "./matchItem";
import { MatchPlayer } from "./matchPlayer";
import { Timeline } from "./timeline";
import { TrackerMatchInfo } from "./trackerMatchInfo";
import { User } from "./user";

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
