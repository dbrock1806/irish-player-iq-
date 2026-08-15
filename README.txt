IRISH PLAYER IQ — FULL CLEAN BUILD

UPLOAD EVERYTHING IN THIS FOLDER TO THE ROOT OF YOUR GITHUB REPOSITORY.

Required root files:
index.html
app.js
styles.css
roster.json
schedule.json
manifest.webmanifest
sw.js
.nojekyll

Folders:
icons/
photos/

The app is a static GitHub Pages PWA. It contains the complete quiz UI, responsive mobile/desktop styling, five bottom-nav sections, mixed quiz, number->player, player->number, player->position, photo modes, hidden-number elite mode, scoring, streaks, 10-question rounds, progress tracking, local persistence, 50/50 tool, skip, season page, and photo fallback handling.

PHOTO FILES
Put uniform photos in photos/. Recommended filename: lowercase slug of the player name, e.g. cj-carr.jpg, leonard-moore.jpg, javian-osborne.jpg. The app also tries several alternate patterns.

IMPORTANT
This is a client-side app. A static page cannot discover new roster facts or photographs by itself. Automatic roster updates require a scheduled GitHub Action or another trusted data source. Do not claim a photo/roster is verified until the source is actually checked.
