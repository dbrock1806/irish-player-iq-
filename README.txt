IRISH PLAYER IQ — FULL REBUILD
================================

This is a standalone static Progressive Web App for GitHub Pages.

FILES
- index.html: entry point
- app.js: game logic + embedded 2026-27 roster + schedule
- styles.css: full responsive styling
- manifest.webmanifest: installable app metadata
- sw.js: offline cache
- icons/: app icons
- photos/: optional local player uniform photos

DEPLOYMENT
1. Upload the contents of this folder to the ROOT of the GitHub repository.
2. Keep index.html, app.js, and styles.css in the repository root.
3. Keep the icons folder and its two PNG files intact.
4. GitHub Settings > Pages > Deploy from branch > main > /(root).

PHOTO LAB
The app automatically looks for:
photos/<player-slug>.jpg

Example:
photos/leonard-moore.jpg
photos/cj-carr.jpg
photos/adon-shuler.jpg

If a photo is missing, the app displays a clean jersey-number placeholder instead of breaking.

FEATURES
- Home dashboard / Irish IQ
- Mix-Up 10-question mode
- Number -> Player
- Player -> Number
- Player -> Position
- Photo -> Player
- Photo -> Number
- Photo -> Position
- Hidden Number / Elite Mode
- 50/50 lifeline
- Streak Boost
- Skip
- Score, streak, best streak, XP and level
- Player mastery/progress
- Season schedule
- Official roster link
- LocalStorage progress
- Offline PWA caching
- Responsive phone + desktop layout

ROSTER SOURCE
Core identity fields are based on the Notre Dame 2026 football roster supplied for this project and cross-checked against the official Notre Dame 2026 roster publication.
