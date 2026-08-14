# Irish Player IQ — Auto-Sync QA Report

## Data verification
- 114 roster entries present at build time.
- 82 unique jersey numbers.
- 12 positions.
- 12 official 2026 regular-season games.
- Official Notre Dame roster page and roster PDF are the authoritative roster sources.
- Official Notre Dame football schedule page is the schedule verification source.

## Automated sync safety
The GitHub Actions workflow runs daily and manually on demand. It:
1. Fetches the official roster page.
2. Finds the latest 2026 roster PDF linked by Notre Dame.
3. Parses the numerical roster.
4. Refuses to replace `roster.json` if fewer than 100 valid players are parsed.
5. Validates unique `(number, name, position)` records.
6. Discovers official profile photo URLs when available.
7. Verifies all 12 expected 2026 schedule opponents/dates before changing `schedule.json`.
8. Runs the gameplay simulation before committing changes.

## Gameplay simulation
100 independent simulated personas were run across 50 rounds each, with 10 questions per round. Skips and 50/50 usage mean the exact question count varies; this run exercised 47,024 answered/generated question events.

Modes covered:
- Mix-Up
- Number → Player
- Player → Number
- Player → Position
- Photo → Player
- Photo → Number
- Photo → Position
- Hidden Number

Also exercised:
- duplicate jersey numbers
- 50/50
- skips
- streak resets
- streak boost scoring
- answer-choice uniqueness
- round progression

Result: PASS.

## Design/data safety
- Local player photos are tried before remote official profile photos.
- Wrong answers do not automatically reveal player identity/number/position.
- Progress is stored locally in the browser and keyed by player name.
- Sync is fail-closed so an upstream formatting change cannot silently publish an empty or partial roster.
