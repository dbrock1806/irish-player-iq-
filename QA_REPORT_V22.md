IRISH PLAYER IQ V22 — FIVE-PLAYER LEARNING PROGRESSION FIX

This build is based on the existing integrated V20/V21 app architecture.
styles.css and all existing data files are preserved.

REQUESTED FIXES IMPLEMENTED
• Learning Mode now uses 5 core players per round.
• Every fresh/restarted learning cycle randomizes the cohort.
• The question scheduler creates explicit unfinished slots for:
  player recognition, number, position and class.
• The selected player and skill are locked together for each question.
• A player is ready for the next round after 2 correct answers in EACH
  of the four skills.
• A round completes only when all 5 core players are ready: 5 players ×
  4 skills × 2 correct demonstrations = 40 maximum required correct
  demonstrations (20 minimum if every answer is exactly on an unfinished
  slot).
• The Learning Mode status now reports the actual round-progress metric:
  Players Ready / 5 and Skills Complete / 20.
• The result panel reports the current player's four skill counters.
• The same per-player knowledge record remains the universal learning source.
• Previously learned players remain eligible for maintenance/review.
• Existing styles.css is not modified.
• index.html cache-busts app.js to v22.

TESTING
• Node JavaScript syntax check: PASS
• 100 simulated five-player learning rounds: PASS
• Simulation completion range: 40–40 questions
• Five-player cohort assertions: PASS
• 2-correct-per-skill progression: PASS
• Round requires all five players: PASS
• Randomized selection: PASS
• Existing stylesheet preserved: PASS
