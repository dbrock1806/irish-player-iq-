# Irish Player IQ — Product Definition

**Purpose:** Learn the Irish, follow the season, and see how much you really know.

Irish Player IQ is a game-style Notre Dame football companion designed to teach every player's **name, jersey number, position, and face**, then keep the experience evolving through the season.

## Learning
- Number + position → player
- Player + position → number
- Player + number → position
- Face → player
- Face → number
- Face → position
- Hidden-number / elite recall
- Mixed challenges that increase difficulty
- Duplicate jersey numbers treated as distinct player identities
- Wrong answers teach the correct answer
- 50/50, Skip, Streak Boost, rounds, streaks, IQ, mastery

## Season companion
- 2026 schedule
- Game Prep before kickoff
- Opponent/matchup study hooks
- Post-game review hooks
- Official game results and player stats
- Milestones
- Playoff matchup support
- Notre Dame history / legends

## Personal learning system
- Overall Irish IQ
- Player mastery
- Number mastery
- Position mastery
- Face/visual mastery
- Recommended study areas
- Persistent local progress

## Data architecture
- `roster.json` is the app's runtime roster source.
- `schedule.json` is the runtime schedule source.
- `stats.json`, `results.json`, `milestones.json`, and `opponents.json` are season-data stores.
- GitHub Actions verifies the roster against Notre Dame's official athletics roster page and fails closed if the parsed result is implausible.
-  remain local in `photos/` so the user can curate uniform-number images without depending on third-party image URLs.
