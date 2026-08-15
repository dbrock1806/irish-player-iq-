# Irish Player IQ — History Mode Update

History Mode: 10-question Notre Dame University + football history test. Questions rise from easy to hard, are randomized without repeats within a game, and one wrong answer ends the game. The correct answer and learning explanation are shown after a miss.

Difficulty formula:
D = clamp(round(1 + 0.85*questionIndex + 0.35*priorCorrect + 0.20*jitter), 1, 10)

Facts are curated from official Notre Dame University/Athletics sources and NCAA historical records and are stored in history.json with source provenance.


## Connected Team Explorer
The Season schedule and every connected team schedule use clickable opponent rows. Selecting a team loads its current 2026 schedule, completed-game scores and W/L results when available, current record/rank when returned by the live data source, and a full roster view. Opponents on that schedule are themselves clickable, creating recursive team-to-team navigation. Official schedule links are provided for the Notre Dame 2026 opponents in `team-sources.json`.
