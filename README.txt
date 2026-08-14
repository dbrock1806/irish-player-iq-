IRISH PLAYER IQ — AUTO-SYNC BUILD

This is a GitHub Pages Progressive Web App for learning the Notre Dame 2026-27 football roster.

AUTOMATIC UPDATES
- GitHub Actions checks the official Notre Dame football roster page daily.
- It discovers the newest official roster PDF linked from that page and parses it.
- The workflow FAILS CLOSED if parsing is not sufficiently complete, so a bad source page cannot wipe out the working roster.
- It verifies the 2026 schedule against Notre Dame's official schedule page.
- It discovers official player profile photo URLs when available. Your local photos/ folder always has priority in the app.
- It records sync-status.json with the source, timestamp, counts, and roster changes.
- The workflow also runs the gameplay QA simulation before committing updates.

IMPORTANT PHOTOS
Keep your existing photos/ folder. The app tries local photos first, then verified official profile-photo URLs when available.

GITHUB ACTIONS
The workflow is .github/workflows/roster-sync.yml. It can be run manually from GitHub Actions with "Run workflow" or automatically on its daily schedule.

PROGRESS
Player mastery is keyed by player name, so roster refreshes do not erase local progress stored in the browser.

GITHUB PAGES
This is a static site. GitHub Pages serves the committed files; GitHub Actions performs the automated verification/update work.

NOTRE DAME SOURCE
https://fightingirish.com/sports/football/roster/season/2026-27/
https://fightingirish.com/sports/football/schedule/season/2026-27/

The app is an independent fan/educational project and is not affiliated with Notre Dame.
