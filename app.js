/* =========================================================
   IRISH PLAYER IQ
   Notre Dame Football • 2026–27
   Standalone app.js
   ========================================================= */

(() => {
  "use strict";

  /* -----------------------------
     VERIFIED ROSTER DATA
     ----------------------------- */

  const ROSTER_DATA = `
0|Tionne Gray|DL
0|Quincy Porter|WR
1|Dallas Golden|CB
1|Jaden Greathouse|WR
2|Nolan James Jr.|RB
2|DJ McKinney|CB
3|Mylan Graham|WR
3|Jaylen Sneed|LB
4|Bubba Frazier|WR
4|Jaiden Ausberry|LB
5|Cam Williams|WR
5|Boubacar Traore|DL
6|Christopher Burgess Jr.|DL
6|Jordan Faison|WR
7|Francis Brewu|DL
7|Ty Washington|TE
8|Jerome Bettis Jr.|WR
8|Adon Shuler|S
9|Brauntae Johnson|S
9|Teddy Jarrard|QB
10|Noah Grubbs|QB
10|Loghan Thomas|DL
11|Keon Keeley|DL
11|Devin Fitzgerald|WR
12|Jayden Sanders|CB
12|Blake Hebert|QB
13|Ayden Pouncey|CB
13|CJ Carr|QB
14|Ebenezer Ewetade|DL
14|Micah Gilbert|WR
15|Brayden Robinson|WR
15|Leonard Moore|CB
16|Dylan Faison|WR
16|Koʿo Kia|LB
17|Elijah Burress|WR
17|Brenan Vernon|DL
18|Kaydon Finley|WR
18|Erik Schmidt|P
19|Madden Faraimo|LB
19|Logan Saldate|WR
20|Joey O'Brien|S
20|Jonaz Walton|RB
21|Khary Adams|CB
21|Kedren Young|RB
22|Ethan Long|S
22|Aneyas Williams|RB
23|Ja'Kobe Clapper|LB
24|Mark Zackery IV|CB
24|Ian Premer|TE
25|Brandon Logan|S
26|Chaz Smith|CB
26|Javian Osborne|RB
27|Kyngstonn Viliamu-Asa|LB
28|Luke Talich|S
29|Christian Gray|CB
30|Patrick Downes|S
31|Xavier Southall|WR
32|Nick Reddish|CB
33|Matt Jeffery|WR
34|Drayk Bowen|LB
35|Spencer Porath|K
35|Teddy Rezac|LB
36|Micah Drescher|K
37|Kurt Smith|RB
38|Tommy Powlus|LB
39|Jasper Scaife|P
40|Dominik Hulak|DL
42|Cole Mullins|DL
42|Henry Garrity|TE
43|Kahanu Kia|LB
44|Rodney Dunham|DL
46|Matt Williams|RB
47|Jason Onye|DL
48|Chase Young|S
49|Andrew Kros|LS
50|Sullivan Garvin|OL
51|Ben Nichols|OL
52|Devan Houstan|OL
54|Anthonie Knapp|OL
55|Tiki Hola|DL
55|Chris Terek|OL
56|Charles Jagusah|OL
56|Elijah Hughes|DL
57|Cam Herron|OL
58|Thomas Davis Jr.|LB
58|Matty Augustine|OL
59|Sean Sevillano Jr.|DL
60|Davion Dixon|DL
60|Max Anderson|OL
61|Robbie Wollan|OL
64|Joe Otting|OL
65|Grayson McKeogh|OL
66|Tyler Merrill|OL
67|Gregory Patrick|OL
68|Charlie Thom|OL
70|Ashton Craig|OL
71|Styles Prescod|OL
74|Will Black|OL
75|Sullivan Absher|OL
76|Guerby Lambert|OL
77|Peter Jones|OL
78|Owen Strebig|OL
84|Preston Fryzel|TE
85|Jack Larsen|TE
86|Kaleb Johnson|TE
87|Cooper Flanagan|TE
88|James Flanigan|TE
88|Armel Mukam|DL
89|Austin Ratigan|TE
90|Elijah Golden|DL
91|Gordy Sulfsted|DL
94|Joe Reiff|DL
95|Bryce Young|DL
96|Joseph Vinci|LS
  `.trim();

  const ROSTER = ROSTER_DATA
    .split("\n")
    .map(line => {
      const [num, name, pos] = line.split("|");
      return { num, name, pos };
    });

  /* -----------------------------
     STATE
     ----------------------------- */

  const STORAGE_KEY = "irish_player_iq_2026";

  let state;

  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    state = {};
  }

  state.score = Number(state.score || 0);
  state.streak = Number(state.streak || 0);
  state.best = Number(state.best || 0);

  let mode = "numberPosition";
  let current = null;
  let locked = false;

  /* -----------------------------
     HELPERS
     ----------------------------- */

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  function shuffle(array) {
    const a = [...array];

    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function randomPlayer() {
    return ROSTER[Math.floor(Math.random() * ROSTER.length)];
  }

  function uniqueValues(field) {
    return [...new Set(ROSTER.map(player => player[field]))];
  }

  /* -----------------------------
     QUESTION GENERATION
     ----------------------------- */

  function getQuestion() {

    if (mode === "numberPosition") {
      return {
        title: `Who wears #${current.num} at ${current.pos}?`,
        label: "NUMBER + POSITION → NAME",
        answer: current.name,
        choices: getNameChoices()
      };
    }

    if (mode === "nameNumber") {
      return {
        title: `What number does ${current.name} wear?`,
        label: "NAME → NUMBER",
        answer: current.num,
        choices: getNumberChoices()
      };
    }

    if (mode === "namePosition") {
      return {
        title: `What position does ${current.name} play?`,
        label: "NAME → POSITION",
        answer: current.pos,
        choices: getPositionChoices()
      };
    }

    return {
      title: `Who wears #${current.num} at ${current.pos}?`,
      label: "NUMBER + POSITION → NAME",
      answer: current.name,
      choices: getNameChoices()
    };
  }

  function getNameChoices() {

    const correct = current.name;

    const wrong = shuffle(
      ROSTER
        .filter(player =>
          player.name !== correct &&
          !(player.num === current.num && player.pos === current.pos)
        )
        .map(player => player.name)
    );

    return shuffle([
      correct,
      ...wrong.slice(0, 3)
    ]);
  }

  function getNumberChoices() {

    const correct = current.num;

    const wrong = shuffle(
      uniqueValues("num").filter(number => number !== correct)
    );

    return shuffle([
      correct,
      ...wrong.slice(0, 3)
    ]);
  }

  function getPositionChoices() {

    const correct = current.pos;

    const wrong = shuffle(
      uniqueValues("pos").filter(position => position !== correct)
    );

    return shuffle([
      correct,
      ...wrong.slice(0, 3)
    ]);
  }

  /* -----------------------------
     BUILD APP
     ----------------------------- */

  function buildApp() {

    document.body.innerHTML = `
      <div class="app">

        <div class="gold-line"></div>

        <header class="header">

          <div class="eyebrow">
            NOTRE DAME FOOTBALL • 2026–27
          </div>

          <h1>
            IRISH PLAYER IQ
          </h1>

          <p class="subtitle">
            Learn the roster. One player at a time.
          </p>

        </header>


        <section class="stats">

          <div class="stat">
            <span>SCORE</span>
            <strong id="score">0</strong>
          </div>

          <div class="stat">
            <span>STREAK</span>
            <strong id="streak">0</strong>
          </div>

          <div class="stat">
            <span>BEST</span>
            <strong id="best">0</strong>
          </div>

        </section>


        <main class="quiz-card">

          <div class="question-label" id="questionLabel">
            NUMBER + POSITION → NAME
          </div>

          <h2 id="question">
            Loading...
          </h2>

          <div class="answers" id="answers"></div>

          <div id="result"></div>

          <button class="next-button" id="nextButton">
            NEXT QUESTION
          </button>

        </main>


        <section class="mode-section">

          <div class="section-title">
            QUIZ MODE
          </div>

          <div class="modes">

            <button
              class="mode active"
              data-mode="numberPosition">
              # + POS → NAME
            </button>

            <button
              class="mode"
              data-mode="nameNumber">
              NAME → #
            </button>

            <button
              class="mode"
              data-mode="namePosition">
              NAME → POS
            </button>

            <button
              class="mode"
              data-mode="numberPosition">
              # + POS → NAME
            </button>

          </div>

        </section>


        <div class="bottom-buttons">

          <button id="resetButton">
            RESET SCORE
          </button>

          <button id="newButton">
            NEW QUESTION
          </button>

        </div>


        <p class="footer-note">
          Duplicate jersey numbers are handled intentionally.
          A number by itself is never used to identify a player.
        </p>

      </div>
    `;

    updateStats();
    bindEvents();
    newQuestion();
  }

  /* -----------------------------
     EVENTS
     ----------------------------- */

  function bindEvents() {

    document
      .getElementById("nextButton")
      .addEventListener("click", newQuestion);

    document
      .getElementById("newButton")
      .addEventListener("click", newQuestion);

    document
      .getElementById("resetButton")
      .addEventListener("click", resetScore);

    document
      .querySelectorAll(".mode")
      .forEach(button => {

        button.addEventListener("click", () => {

          mode = button.dataset.mode;

          document
            .querySelectorAll(".mode")
            .forEach(b => b.classList.remove("active"));

          button.classList.add("active");

          newQuestion();
        });

      });
  }

  /* -----------------------------
     NEW QUESTION
     ----------------------------- */

  function newQuestion() {

    current = randomPlayer();
    locked = false;

    const question = getQuestion();

    document.getElementById("questionLabel").textContent =
      question.label;

    document.getElementById("question").textContent =
      question.title;

    document.getElementById("result").innerHTML = "";

    const next = document.getElementById("nextButton");

    next.style.display = "none";

    const answers = document.getElementById("answers");

    answers.innerHTML = question.choices
      .map((choice, index) => `
        <button
          class="answer"
          data-index="${index}">
          ${escapeHTML(choice)}
        </button>
      `)
      .join("");

    answers
      .querySelectorAll(".answer")
      .forEach(button => {

        button.addEventListener("click", () => {

          answerQuestion(
            Number(button.dataset.index),
            question
          );

        });

      });
  }

  /* -----------------------------
     ANSWER
     ----------------------------- */

  function answerQuestion(index, question) {

    if (locked) return;

    locked = true;

    const buttons = [
      ...document.querySelectorAll(".answer")
    ];

    const selected =
      question.choices[index];

    const correct =
      selected === question.answer;

    buttons.forEach(button => {
      button.disabled = true;
    });

    if (correct) {

      state.score++;
      state.streak++;

      if (state.streak > state.best) {
        state.best = state.streak;
      }

      buttons[index].classList.add("correct-answer");

      document.getElementById("result").innerHTML = `
        <div class="result correct-result">
          <div class="result-icon">✓</div>
          <div>
            <strong>CORRECT!</strong>
            <span>
              ${escapeHTML(current.name)}
              • #${escapeHTML(current.num)}
              • ${escapeHTML(current.pos)}
            </span>
          </div>
        </div>
      `;

    } else {

      state.streak = 0;

      buttons[index].classList.add("wrong-answer");

      buttons.forEach(button => {

        if (button.textContent.trim() === question.answer) {
          button.classList.add("correct-answer");
        }

      });

      document.getElementById("result").innerHTML = `
        <div class="result wrong-result">
          <div class="result-icon">✕</div>
          <div>
            <strong>NOT QUITE</strong>
            <span>
              ${escapeHTML(current.name)}
              wears #${escapeHTML(current.num)}
              (${escapeHTML(current.pos)})
            </span>
          </div>
        </div>
      `;
    }

    save();
    updateStats();

    document.getElementById("nextButton").style.display =
      "block";
  }

  /* -----------------------------
     STATS
     ----------------------------- */

  function updateStats() {

    const score = document.getElementById("score");
    const streak = document.getElementById("streak");
    const best = document.getElementById("best");

    if (score) score.textContent = state.score;
    if (streak) streak.textContent = state.streak;
    if (best) best.textContent = state.best;
  }

  /* -----------------------------
     RESET
     ----------------------------- */

  function resetScore() {

    const confirmed =
      window.confirm(
        "Reset your Irish Player IQ score and streak?"
      );

    if (!confirmed) return;

    state.score = 0;
    state.streak = 0;
    state.best = 0;

    save();
    updateStats();
    newQuestion();
  }

  /* -----------------------------
     STYLES
     ----------------------------- */

  const style = document.createElement("style");

  style.textContent = `

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html {
      background: #020d1b;
    }

    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(
          circle at 50% -10%,
          #12365c 0%,
          #071b32 38%,
          #020d1b 75%
        );
      color: white;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    button {
      font-family: inherit;
    }

    .app {
      width: 100%;
      max-width: 900px;
      min-height: 100vh;
      margin: auto;
      padding:
        0
        28px
        50px;
    }

    .gold-line {
      height: 5px;
      width: 100%;
      background:
        linear-gradient(
          90deg,
          #d5a91a,
          #f9d75c,
          #d5a91a
        );
    }

    .header {
      text-align: center;
      padding-top: 42px;
    }

    .eyebrow {
      color: #a9b9cc;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 3px;
      margin-bottom: 13px;
    }

    h1 {
      margin: 0;
      color: #f5d35b;
      font-size: clamp(42px, 11vw, 78px);
      line-height: .95;
      letter-spacing: -3px;
      font-weight: 950;
    }

    .subtitle {
      margin:
        22px
        0
        32px;

      color: #aabbd0;
      font-size: clamp(18px, 4vw, 27px);
    }

    .stats {
      display: grid;
      grid-template-columns:
        repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 32px;
    }

    .stat {
      min-height: 105px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      background:
        linear-gradient(
          145deg,
          rgba(25,61,96,.92),
          rgba(10,35,60,.95)
        );

      border: 2px solid #234d73;
      border-radius: 24px;

      box-shadow:
        0 12px 30px rgba(0,0,0,.2);
    }

    .stat span {
      color: #aebed0;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 2px;
    }

    .stat strong {
      margin-top: 5px;
      font-size: 42px;
      line-height: 1;
    }

    .quiz-card {
      padding: 32px;
      border-radius: 30px;

      background:
        linear-gradient(
          145deg,
          rgba(24,48,74,.98),
          rgba(12,31,52,.98)
        );

      border: 2px solid #275579;

      box-shadow:
        0 20px 55px rgba(0,0,0,.28);
    }

    .question-label {
      color: #f4d35e;
      font-size: 15px;
      font-weight: 950;
      letter-spacing: 2px;
    }

    #question {
      margin:
        14px
        0
        28px;

      font-size:
        clamp(30px, 7vw, 50px);

      line-height: 1.08;
      letter-spacing: -.8px;
    }

    .answers {
      display: grid;
      gap: 14px;
    }

    .answer {
      width: 100%;
      min-height: 76px;

      padding:
        16px
        20px;

      border-radius: 20px;
      border: 2px solid #35698f;

      background:
        linear-gradient(
          145deg,
          #14395f,
          #0e2c4c
        );

      color: white;

      font-size:
        clamp(18px, 4.5vw, 26px);

      font-weight: 850;
      text-align: left;

      transition:
        transform .12s,
        border-color .12s,
        background .12s;
    }

    .answer:active {
      transform: scale(.985);
    }

    .answer.correct-answer {
      background: #123d2e;
      border-color: #55d69b;
    }

    .answer.wrong-answer {
      background: #47242b;
      border-color: #e76d75;
    }

    .result {
      display: flex;
      align-items: center;
      gap: 13px;

      margin-top: 18px;
      padding: 15px 17px;

      border-radius: 17px;
    }

    .result-icon {
      width: 34px;
      height: 34px;

      display: grid;
      place-items: center;

      border-radius: 50%;
      font-weight: 950;
      font-size: 20px;
    }

    .result strong,
    .result span {
      display: block;
    }

    .result strong {
      font-size: 16px;
    }

    .result span {
      margin-top: 3px;
      color: #c2cfdb;
      font-size: 14px;
    }

    .correct-result {
      background: #10392b;
      border: 1px solid #276d51;
    }

    .correct-result .result-icon {
      background: #1b6d4b;
      color: #a9f4cf;
    }

    .wrong-result {
      background: #45242a;
      border: 1px solid #7a3c45;
    }

    .wrong-result .result-icon {
      background: #7c3943;
      color: #ffd1d1;
    }

    .next-button {
      width: 100%;
      min-height: 66px;

      margin-top: 18px;

      border: 0;
      border-radius: 18px;

      background:
        linear-gradient(
          180deg,
          #f8d968,
          #edc64a
        );

      color: #071728;

      font-size: 18px;
      font-weight: 950;
      letter-spacing: .5px;

      box-shadow:
        0 8px 20px rgba(0,0,0,.2);
    }

    .mode-section {
      margin-top: 32px;
    }

    .section-title {
      margin-bottom: 14px;

      color: #aebed0;
      font-size: 14px;
      font-weight: 950;
      letter-spacing: 2px;
    }

    .modes {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .mode,
    #resetButton,
    #newButton {

      min-height: 60px;

      border-radius: 17px;
      border: 2px solid #315d80;

      background: #0d2b4b;
      color: #b9c8d8;

      font-size: 15px;
      font-weight: 950;
      letter-spacing: .4px;
    }

    .mode.active {
      background: #f5d35b;
      color: #071728;
      border-color: #f5d35b;
    }

    .bottom-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }

    #resetButton,
    #newButton {
      color: #b9c8d8;
    }

    .footer-note {
      max-width: 650px;
      margin:
        28px
        auto
        0;

      text-align: center;

      color: #71869c;
      font-size: 13px;
      line-height: 1.55;
    }

    @media (max-width: 600px) {

      .app {
        padding-left: 16px;
        padding-right: 16px;
      }

      .header {
        padding-top: 34px;
      }

      h1 {
        font-size: 48px;
        letter-spacing: -2px;
      }

      .subtitle {
        font-size: 19px;
        margin-top: 17px;
      }

      .stats {
        gap: 8px;
      }

      .stat {
        min-height: 91px;
        border-radius: 19px;
      }

      .stat span {
        font-size: 11px;
      }

      .stat strong {
        font-size: 34px;
      }

      .quiz-card {
        padding: 22px 18px;
        border-radius: 24px;
      }

      .question-label {
        font-size: 12px;
      }

      #question {
        font-size: 31px;
      }

      .answer {
        min-height: 68px;
        font-size: 19px;
        border-radius: 17px;
      }

      .mode,
      #resetButton,
      #newButton {
        min-height: 56px;
        font-size: 12px;
      }
    }

  `;

  document.head.appendChild(style);

  /* -----------------------------
     START
     ----------------------------- */

  buildApp();

})();
