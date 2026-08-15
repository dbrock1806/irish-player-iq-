# Connected Team Explorer QA

Build: v16
Date: 2026-08-14

## Requirements tested

- Notre Dame season schedule rows are clickable.
- Clicking an opponent opens a dedicated connected team page.
- Connected team page shows current record/rank when returned by the live source.
- Completed games show W/L and score.
- Upcoming games show UPCOMING.
- Every opponent row on a connected team schedule is clickable, enabling recursive team-to-team exploration.
- Full roster button is available for every connected team.
- Official schedule link is provided for known Notre Dame opponents.
- Notre Dame remains the root season schedule and uses the same opponent-link behavior.
- Live schedule/roster calls are fail-safe: an unavailable live response does not fabricate data; the official-source link remains available.

## Data validation

- Notre Dame 2026 schedule contains 12 regular-season opponents in official order.
- First game is Wisconsin at Lambeau Field on September 6, 2026.
- No game result is fabricated when a game is not final.
- The connected team view derives W/L from completed-game winner flags or final scores.
- JSON files in the package parse successfully.
- app.js passes Node syntax validation.

## Live data source architecture

The connected explorer uses ESPN's public college-football site endpoints for team schedules, team details and rosters. The app displays official athletics links for the core Notre Dame opponents so the user can cross-check the live data. ESPN endpoint patterns for team schedules and rosters are documented publicly. The app never invents a schedule or result when the live request fails.
