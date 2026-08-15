# Irish Player IQ — Complete Build

This is the complete GitHub Pages/PWA package for Irish Player IQ.

## Upload
Upload the **contents of this folder** to the root of the GitHub repository. Do not upload the ZIP itself.

Keep your real player images inside `photos/`. The included `photos/README.txt` is only a placeholder.

## Core files
- `index.html` — app entry point
- `app.js` — game/app logic
- `styles.css` — Notre Dame mobile-first styling
- `roster.json` — verified runtime roster (114 players in this package)
- `schedule.json` — 2026 schedule
- `stats.json` — season stats store
- `results.json` — game results store
- `milestones.json` — milestones store
- `opponents.json` — opponent study store
- `manifest.webmanifest`, `sw.js`, `.nojekyll` — PWA/GitHub Pages support
- `.github/workflows/roster-sync.yml` — scheduled official-roster verification
- `scripts/` — validation/sync tools
- `PRODUCT_SPEC.md` — product definition
- `QA_REPORT.md` — QA notes

## Quiz behavior
- Player → Number shows the player's **name + position**.
- Player → Position shows the player's **name + number**.
- Wrong answers reveal the correct answer to reinforce learning.
- Number + position are used together when identifying a player because jersey numbers can be duplicated.

## Automatic roster verification
The GitHub Actions workflow checks Notre Dame's official 2026–27 roster page daily. It is fail-closed: it will not overwrite the bundled roster if the parser produces an implausibly small or malformed roster.

## Photos
The app searches several filename patterns based on player name/number. Keep your existing uniform photos in `photos/`. A missing image falls back to a neutral ND placeholder and never reveals the quiz answer.


LEARNING MODE
Starts with 6 players. Each player requires 6 correct recalls to be mastered. Four directions are mixed: Player→Number, Number→Player, Player→Position, Position→Player. Once every player in the current pool is mastered, 3 new players are introduced. Progress persists locally.
