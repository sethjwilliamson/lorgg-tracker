import { MatchItem } from "./matchItem";
import { MatchPlayer } from "./matchPlayer";
import { User } from "./user";

export function createSampleData() {
  //User.truncate();

  let user: User = User.build({
    id: Math.floor(Math.random() * 10000),
    tagLine: "test",
    displayName: "test",
    server: "test",
  });

  let matchItem: MatchItem = MatchItem.build({
    id: Math.floor(Math.random() * 10000),
    riotMatchId: `Test-${Math.floor(Math.random() * 10000)}`,
    gameMode: "Constructed",
    gameType: "Ranked",
    server: "americas",
    startedAt: new Date(),
  });
  /*
    let matchPlayerLocal: MatchPlayer = MatchPlayer.build({
        isVictory: true,
        isFirst: false,
        
    })

    let matchPlayerOpponent: MatchPlayer = MatchPlayer.build({
        isVictory: false,
        isFirst: true
    })
    

    user.setMatchPlayers([matchPlayerLocal])

    user.save()
    matchPlayerLocal.save();

    //matchPlayerLocal.setMatchItem()
*/

  matchItem.save();
}
