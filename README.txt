IRISH PLAYER IQ — LEARNING ENGINE TEST BUILD v19

Replace ONLY app.js and styles.css in your existing repository.

This build specifically updates Learning Mode while preserving the existing data files and other app features.

Learning Mode changes:
- Starts each cohort with 6 players and shows an introduction screen before testing.
- Tracks separate mastery for number, player identity, position, and class.
- Correct answers increase the relevant skill by 20 points; wrong answers decrease it by 15.
- Good Understanding: 5 correct in a row OR 6 of the last 7, plus at least 65% overall.
- Mastered: Good Understanding + every skill >=90 + at least 2 attempts per skill + one post-understanding success in each skill + overall >=90.
- Round ends only when all 6 core players are fully mastered.
- Next round introduces the next 6 players.
- Previously learned players remain in a maintenance/review pool and can return to keep knowledge fresh.
- New players are weighted more heavily, while weak/older players receive more review.
- Class questions are included as a first-class learning skill.
- Learning Mode has no Boost feature.
- Learning Mode header does not show IQ score.
- Question/player/type history reduces immediate repetition and recognizable patterns.
- Old Learning Mode state is migrated to a fresh v19 learning schema so the new engine can be tested cleanly without deleting the rest of the app's progress.

Also included:
- Cache-busting version updated to 20260815-v19.
- Existing 50/50 and Skip controls remain available outside the learning mastery engine.
