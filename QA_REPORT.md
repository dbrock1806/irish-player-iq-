# Irish Player IQ QA Report — 2026-08-14

## Source verification
Roster class data is based on Notre Dame's official 2026 June football roster. The roster contains 114 players, 82 unique jersey numbers, 12 positions, and four class labels.

## Bugs fixed
1. **Duplicate-number ambiguity:** Number → Player now presents jersey number + position, making the intended player unique.
2. **Duplicate-position ambiguity:** No question asks position-only → player. Position learning is Player + Number → Position.
3. **Learning Mode stuck at six:** mastery completion now triggers automatic pool expansion by three players.
4. **Weak learning definition:** a player is not mastered until the user has two correct recalls for number, player identity, and position.
5. **Class display:** roster records now carry class and quiz identity cards/support lines show it.
6. **Roster sync:** the sync parser preserves the official Class column.
7. **Wrong-answer teaching:** learning feedback includes the correct answer and class.

## Automated QA
- JavaScript syntax: PASS
- Roster JSON validation: PASS
- 114 players: PASS
- 82 unique jersey numbers: PASS
- 12 positions: PASS
- Four class labels: PASS
- 12 scheduled games: PASS
- 100 simulated learners progressing from 6 players to the full roster: PASS
- Ambiguous number + position player choices: 0
- Duplicate answer choices in number/position modes: 0
