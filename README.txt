IRISH PLAYER IQ — V18 BUG FIX

REPLACE ONLY THESE TWO FILES IN YOUR EXISTING GITHUB REPOSITORY:
1. app.js
2. styles.css

Do NOT delete or replace your other files.

FIXES IN THIS VERSION
- Restores working game-mode buttons by adding the missing newQuestion() lifecycle function.
- Resets the locked-answer state whenever a new question starts.
- Uses one delegated click handler so navigation, modes, answer buttons, actions, and team links continue working after every screen re-render.
- Fixes Schedule row buttons using explicit dark backgrounds, white opponent names, and visible contrast instead of browser-default light button styling.
- Keeps the bottom navigation dark and clickable.
- Fixes Notre Dame player bio links to use the current official Fighting Irish roster URL pattern, with Ko'o Kia special-cased to the verified slug.

TESTS RUN
- Node JavaScript syntax check: PASS
- JSON validation for roster/schedule/rankings/opponents/results/stats/history: PASS
- 114-player roster count: PASS
- Duplicate number+position identities: PASS (0)
- Duplicate number+position+class identities: PASS (0)
- Notre Dame schedule count: PASS (12)
- First scheduled opponent: Wisconsin
- Interactive action coverage: PASS
- Question lifecycle/lock reset smoke test: PASS
- Local HTTP asset availability for all required files: PASS (HTTP 200)
- Official Notre Dame roster/source verification: PASS

NOTE
The automated browser environment used for this QA run blocks local/file browser pages, so no claim is made that a real Safari/Chrome click test was completed inside that environment. The interaction code was instead checked with a source-level smoke harness plus local HTTP asset tests.
