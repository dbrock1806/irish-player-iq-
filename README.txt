IRISH PLAYER IQ — ULTIMATE REBUILD
====================================

Static GitHub Pages Progressive Web App.

ROOT FILES
- index.html
- app.js
- styles.css
- manifest.webmanifest
- sw.js
- .nojekyll

FOLDERS
- icons/
- photos/

FEATURES
- Home dashboard
- Mix-Up 10-question rounds
- Number -> Player
- Player -> Number
- Player -> Position
- Photo -> Player / Number / Position
- Hidden Number mode
- 50/50 and streak boost controls
- Score, streak, best streak, XP and levels
- Player mastery / progress
- 2026 season schedule
- Mobile bottom navigation
- PWA install/offline shell
- Duplicate jersey numbers handled by number + position where identity is required

PHOTO SYSTEM
Add official uniform photos to /photos using lowercase hyphenated filenames.
Example:
photos/leonard-moore.jpg
photos/cj-carr.jpg
photos/adon-shuler.jpg

The app will automatically use a photo when the filename exists. If it does not,
the app displays a safe roster-card placeholder instead of breaking.

DATA
Roster identity fields are the 114-player roster supplied for this project.
The 2026 schedule follows Notre Dame's official schedule.

IMPORTANT
Do not put this package inside an extra nested folder when uploading to GitHub.
index.html must be in the repository root.
