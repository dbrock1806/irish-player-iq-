# Irish Player IQ v6 — Verified Live Data Edition

## Core learning
Player/number/position learning remains the primary function. Irish Mix-Up rotates recall direction and mastery tracks name, number, position and visual recognition separately.

## Accuracy policy
- Core roster identity data is sourced from Notre Dame's official 2026-27 football roster.
- Statistics are populated only from explicit Notre Dame and NCAA statistical sources.
- No projections, guesses, inferred starters, or unverified player facts are scored.
- If a fact has not been verified, the app omits it rather than displaying an "unknown" value.
- Photos are never automatically promoted from candidate to scored-question status.

## Live update architecture
- Hosted app refreshes JSON data on open.
- Service worker uses network-first behavior for `/data/*` so fresh data is preferred.
- GitHub Actions checks the official roster/schedule and NCAA current FBS statistical feeds hourly.
- Playoff games are added only when an official matchup exists.

## Sources
Notre Dame roster: https://fightingirish.com/sports/football/roster/season/2026-27/
Notre Dame schedule: https://fightingirish.com/sports/football/schedule/season/2026-27/
NCAA current FBS statistics: https://www.ncaa.com/stats/football/fbs/current/individual/469

## Deployment
This is a static PWA. It requires HTTPS hosting for normal iPhone PWA behavior. The ZIP is deployable to a static host; the included GitHub workflow provides the automated data-refresh mechanism when the repository is hosted on GitHub.
