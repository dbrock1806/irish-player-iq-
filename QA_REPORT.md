# Irish Player IQ v19 — Learning Engine QA

Static checks completed before packaging:
- JavaScript syntax check: PASS (node --check)
- Learning mastery state schema: PASS
- Four independent skills: number, player, position, class
- Correct/wrong scoring deltas: +20 / -15
- Good Understanding conditions: PASS
- Mastered conditions: PASS
- Six-player cohort initialization: PASS
- Cohort advancement logic: PASS
- Maintenance/review pool logic: PASS
- Randomized player/question-type selection with recent-history avoidance: PASS
- Class question generation: PASS
- No Boost control in Learning Mode: PASS
- Learning Mode IQ score omitted from quiz header: PASS
- Cache-busting version updated: PASS

Important: This package is a targeted replacement for app.js and styles.css. Existing roster, schedule, opponent, history, rankings, results, and other data files are intentionally not replaced.
