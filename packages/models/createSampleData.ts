import { Deck } from "./deck";
import { MatchItem } from "./matchItem";
import { MatchPlayer } from "./matchPlayer";
import { User } from "./user";

export async function createSampleData() {
  return;
  //User.truncate();

  let user: User = await User.create({
    id: Math.floor(Math.random() * 10000),
    tagLine: "test",
    displayName: "test",
    server: "test",
  });

  let opponent: User = await User.create({
    id: Math.floor(Math.random() * 10000),
    tagLine: "test",
    displayName: "opponent",
    server: "test",
  });

  let matchItem: MatchItem = await MatchItem.create({
    id: Math.floor(Math.random() * 10000),
    riotMatchId: `Test-${Math.floor(Math.random() * 10000)}`,
    gameMode: "Constructed",
    gameType: "Ranked",
    server: "americas",
    startedAt: new Date(),
  });

  let localDeck: Deck = await Deck.create({
    id: Math.floor(Math.random() * 10000),
    deckCode: "CEAAA",
  });

  let opponentDeck: Deck = await Deck.create({
    id: Math.floor(Math.random() * 10000),
    deckCode: "CEAAAA",
  });

  let matchPlayerLocal: MatchPlayer = await MatchPlayer.create({
    id: Math.floor(Math.random() * 10000),
    isFirst: true,
    isVictory: true,
    userId: user.id,
  });

  let matchPlayerOpponent: MatchPlayer = await MatchPlayer.create({
    id: Math.floor(Math.random() * 10000),
    isFirst: false,
    isVictory: false,
    userId: opponent.id,
  });

  matchPlayerLocal.setMatchItem(matchItem);
}
