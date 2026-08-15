# Irish Player IQ — QA Report

Build: Complete Final Package
Date: 2026-08-14

## Data validation
- 114 roster records loaded
- 82 unique jersey numbers
- 12 positions
- 12 scheduled 2026 games
- roster/schedule/stats/results/milestones/opponents JSON all parse successfully
- JavaScript syntax check passes with Node

## Gameplay simulation
- 100 independent simulated users
- 100 questions per user
- 10,000 total simulated questions
- all seven learning modes exercised
- four-choice integrity checked
- correct answer inclusion checked
- duplicate-answer prevention checked
- duplicate jersey-number identity checked
- Player → Number context: name + position checked
- Player → Position context: name + number checked

Result: PASS

## Product intent checks
- wrong answers reveal the correct answer to reinforce learning
- number-only identity is never treated as unique when duplicate jersey numbers exist
- runtime roster loads from `roster.json`, with embedded fallback
- schedule loads from `schedule.json`, with embedded fallback in the UI
- local progress persists in browser storage
- photos are local and optional; missing photos fall back to a neutral placeholder

## Automatic verification
GitHub Actions verifies the official Notre Dame 2026–27 roster page daily and fails closed if the parsed roster is implausibly small or malformed. It does not silently replace a valid roster with bad data.

## Known data boundary
2026 game statistics, results, milestones, playoff matchups, and opponent scouting content are empty until official information exists. Their JSON stores and app sections are included so they can be populated as the season progresses.
