IRISH PLAYER IQ — COMPLETE APP PACKAGE

This package is the clean rebuild of the Notre Dame football roster memory game.

UPLOAD ALL OF THESE FILES/FOLDERS TO THE ROOT OF THE REPOSITORY:
- index.html
- app.js
- styles.css
- manifest.webmanifest
- sw.js
- .nojekyll
- icons/icon-192.png
- icons/icon-512.png

OPTIONAL:
- .github/workflows/pages.yml is included as a second deployment method.
  For the first setup, use GitHub Pages -> Deploy from a branch -> main -> /(root).
  Do not switch to Actions until the branch/root version is confirmed working.

CURRENT APP FEATURES:
- Notre Dame 2026–27 roster embedded locally
- Duplicate jersey numbers handled using number + position
- Number + position -> player quiz
- Player -> number quiz
- Player -> position quiz
- Score, streak, best score
- Reset score
- Roster study/review
- Photo Lab section ready for verified uniform photos
- Responsive desktop/mobile design
- PWA manifest and install metadata
- Offline-capable static assets after first successful load
- No npm/build step and no external API required for the quiz

PHOTO FEATURE:
The Photo Lab is intentionally prepared but does not invent or hot-link unverified player images.
The next phase can add official Notre Dame uniform photos with jersey numbers visible and
then create photo-based quiz questions.

GITHUB PAGES:
1. Upload the files/folders above directly to the repository ROOT.
2. Commit to main.
3. Settings -> Pages -> Source: Deploy from a branch.
4. Branch: main.
5. Folder: /(root).
6. Save.
7. Wait for the Pages deployment.
8. Test the site in a private/incognito window.

IMPORTANT:
The exact filename "index.html" is required and is case-sensitive.
Do not put the files inside an extra folder.
Do not upload only the ZIP.
