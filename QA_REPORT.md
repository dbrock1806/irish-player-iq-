IRISH PLAYER IQ — V21 INTEGRATED LEARNING UPDATE

BASELINE
This update is based on the V20 full-app architecture, not the broken V21
standalone learning test. The existing styles.css and data files remain intact.

REPLACE ONLY
- index.html
- app.js

DO NOT REPLACE
- styles.css
- roster.json
- schedule.json
- rankings.json
- opponents.json
- results.json
- stats.json
- history.json
- photos/
- icons/
- manifest.webmanifest

CHANGES
- Learning Mode starting six are randomized.
- Starting a new Learning Mode session randomizes the cohort again.
- New cohorts are randomized instead of ordered by jersey number.
- Each player tracks four independent skills:
  player recognition, number, position, class.
- A round is complete when every core player has answered each of the
  four skill types correctly at least twice.
- Wrong answers decrease the corresponding skill score.
- Correct answers increase the corresponding skill score.
- Full mastery remains a higher bar than round completion, so learned players
  continue to receive spaced review.
- Quick Play, Number -> Player, Player -> Number, Player -> Position and
  Elite roster questions feed the same per-player learning system.
- Learning Mode keeps the existing app's established visual/navigation
  architecture.
- Existing bottom navigation and other game/page renderers are preserved.
- Cache-busting version updated in index.html.

REGRESSION CHECKS
- JavaScript syntax: PASS
- Home renderer: PASS
- My Irish IQ renderer: PASS
- Roster renderer: PASS
- Schedule renderer: PASS
- More renderer: PASS
- Team explorer renderer: PASS
- Quick Play generator: PASS
- Elite generator: PASS
- History generator: PASS
- Game Prep generator: PASS
- Post Game generator: PASS
- Bottom navigation class contract: PASS
- Learning cohort randomization: PASS
- Per-skill learning tracking: PASS
- Universal learning update hook: PASS
- 100 randomized learning simulations: PASS
- Correct-answer growth: PASS
- Wrong-answer decay: PASS

IMPORTANT
This package deliberately restores the V20 DOM/class architecture that
styles.css expects. The prior V21 test used a different markup structure,
which caused the gray/default button rendering seen in Safari.
