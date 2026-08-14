/* =========================================================
   IRISH PLAYER IQ
   Notre Dame Football • 2026–27
   Standalone app.js
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     ROSTER
     ========================================================= */

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

  const ROSTER = ROSTER_DATA.split("\n").map(line => {
    const [num, name, pos] = line.split("|");
    return { num, name, pos };
  });

  /* =========================================================
     STATE
     ========================================================= */

  const STORAGE_KEY = "irish_player_iq_2026";

  let state = {
    score: 0,
    streak: 0,
    best: 0
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      state.score = Number(saved.score) || 0;
      state.streak = Number(saved.streak) || 0;
      state.best = Number(saved.best) || 0;
    }
  } catch (e) {}

  let mode = "numberPosition";
  let current = null;
  let locked = false;

  /* =========================================================
     HELPERS
     ========================================================= */

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
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

  function unique(field) {
    return [...new Set(ROSTER.map(player => player[field]))];
  }

  /* =========================================================
     QUESTION LOGIC
     ========================================================= */

  function getQuestion() {

    if (mode === "numberPosition") {
      return {
        label: "NUMBER + POSITION → NAME",
        text: `Who wears #${current.num} at ${current.pos}?`,
        answer: current.name,
        choices: nameChoices()
      };
    }

    if (mode === "nameNumber") {
      return {
        label: "NAME → NUMBER",
        text: `What number does ${current.name} wear?`,
        answer: current.num,
        choices: numberChoices()
      };
    }

    if (mode === "namePosition") {
      return {
        label: "NAME → POSITION",
        text: `What position does ${current.name} play?`,
        answer: current.pos,
        choices: positionChoices()
      };
    }

    return {
      label: "NUMBER + POSITION → NAME",
      text: `Who wears #${current.num} at ${current.pos}?`,
      answer: current.name,
      choices: nameChoices()
    };
  }

  function nameChoices() {

    const wrong = ROSTER
      .filter(player =>
        player.name !== current.name &&
        !(player.num === current.num && player.pos === current.pos)
      )
      .map(player => player.name);

    return shuffle([
      current.name,
      ...shuffle([...new Set(wrong)]).slice(0, 3)
    ]);
  }

  function numberChoices() {

    const wrong = unique("num")
      .filter(num => num !== current.num);

    return shuffle([
      current.num,
      ...shuffle(wrong).slice(0, 3)
    ]);
  }

  function positionChoices() {

    const wrong = unique("pos")
      .filter(pos => pos !== current.pos);

    return shuffle([
      current.pos,
      ...shuffle(wrong).slice(0, 3)
    ]);
  }

  /* =========================================================
     APP HTML
     ========================================================= */

  function buildApp() {

    document.body.innerHTML = `
      <div class="app">

        <div class="gold-line"></div>

        <header class="header">

          <div class="eyebrow">
            NOTRE DAME FOOTBALL • 2026–27
          </div>

          <h1>IRISH PLAYER IQ</h1>

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

          <div class="question-label" id="questionLabel"></div>

          <h2 id="question">Loading...</h2>

          <div class="answers" id="answers"></div>

          <div id="result"></div>

          <button
            class="next-button"
            id="nextButton"
            style="display:none">
            NEXT QUESTION
          </button>

        </main>

        <section class="mode-section">

          <div class="section-title">
            QUIZ MODE
          </div>

          <div class="modes">

            <button class="mode active" data-mode="numberPosition">
              # + POS → NAME
            </button>

            <button class="mode" data-mode="nameNumber">
              NAME → #
            </button>

            <button class="mode" data-mode="namePosition">
              NAME → POS
            </button>

            <button class="mode" data-mode="numberPosition">
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

  /* =========================================================
     EVENTS
     ========================================================= */

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

  /* =========================================================
     NEW QUESTION
     ========================================================= */

  function newQuestion() {

    current = randomPlayer();
    locked = false;

    const question = getQuestion();

    document.getElementById("questionLabel").textContent =
      question.label;

    document.getElementById("question").textContent =
      question.text;

    document.getElementById("result").innerHTML = "";

    document.getElementById("nextButton").style.display = "none";

    const answers = document.getElementById("answers");

    answers.innerHTML = question.choices.map((choice, index) => `
      <button
        class="answer"
        data-index="${index}">
        ${escapeHTML(choice)}
      </button>
    `).join("");

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

  /* =========================================================
     ANSWER
     ========================================================= */

  function answerQuestion(index, question) {

    if (locked) return;

    locked = true;

    const buttons = [
      ...document.querySelectorAll(".answer")
    ];

    const selected = question.choices[index];

    const correct = selected === question.answer;

    buttons.forEach(button => {
      button.disabled = true;
    });

    if (correct) {

      state.score++;
      state.streak++;
      state.best = Math.max(state.best, state.streak);

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

        if (
          button.textContent.trim() ===
          question.answer
        ) {
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

    document.getElementById("nextButton").style.display = "block";
  }

  /* =========================================================
     STATS
     ========================================================= */

  function updateStats() {

    const score = document.getElementById("score");
    const streak = document.getElementById("streak");
    const best = document.getElementById("best");

    if (score) score.textContent = state.score;
    if (streak) streak.textContent = state.streak;
    if (best) best.textContent = state.best;
  }

  /* =========================================================
     RESET
     ========================================================= */

  function resetScore() {

    if (
      !window.confirm(
        "Reset your Irish Player IQ score and streak?"
      )
    ) {
      return;
    }

    state.score = 0;
    state.streak = 0;
    state.best = 0;

    save();
    updateStats();
    newQuestion();
  }

  /* =========================================================
     STYLING
     ========================================================= */

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
          circle at 50% -12%,
          #163b63 0%,
          #09213c 34%,
          #020d1b 78%
        );

      color: #ffffff;

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Arial,
        sans-serif;
    }

    button {
      font-family: inherit;
      cursor: pointer;
    }

    .app {
      width: 100%;
      max-width: 900px;
      min-height: 100vh;
      margin: 0 auto;
      padding: 0 28px 55px;
    }

    .gold-line {
      width: 100%;
      height: 5px;

      background:
        linear-gradient(
          90deg,
          #c89b1c,
          #f8d75e,
          #c89b1c
        );
    }

    .header {
      text-align: center;
      padding-top: 42px;
    }

    .eyebrow {
      color: #a9b9cc;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 3px;
      margin-bottom: 14px;
    }

    h1 {
      margin: 0;

      color: #f6d45b;

      font-size:
        clamp(44px, 10vw, 82px);

      line-height: .94;
      letter-spacing: -4px;
      font-weight: 950;
    }

    .subtitle {
      margin: 22px 0 34px;

      color: #a9bbcf;

      font-size:
        clamp(18px, 4vw, 28px);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 32px;
    }

    .stat {
      min-height: 108px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      background:
        linear-gradient(
          145deg,
          rgba(24,58,92,.98),
          rgba(10,34,59,.98)
        );

      border: 2px solid #28557c;
      border-radius: 25px;

      box-shadow:
        0 14px 32px rgba(0,0,0,.24);
    }

    .stat span {
      color: #aebed0;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 2px;
    }

    .stat strong {
      margin-top: 5px;
      font-size: 43px;
      line-height: 1;
    }

    .quiz-card {
      padding: 34px;

      background:
        linear-gradient(
          145deg,
          rgba(25,50,77,.98),
          rgba(11,30,51,.98)
        );

      border: 2px solid #2a5a80;
      border-radius: 30px;

      box-shadow:
        0 22px 60px rgba(0,0,0,.3);
    }

    .question-label {
      color: #f4d35e;

      font-size: 15px;
      font-weight: 950;
      letter-spacing: 2px;
    }

    #question {
      margin: 15px 0 29px;

      color: #ffffff;

      font-size:
        clamp(30px, 6.5vw, 51px);

      line-height: 1.08;
      letter-spacing: -.9px;
    }

    .answers {
      display: grid;
      gap: 14px;
    }

    .answer {
      width: 100%;
      min-height: 76px;

      padding: 16px 22px;

      border: 2px solid #356b92;
      border-radius: 20px;

      background:
        linear-gradient(
          145deg,
          #153d64,
          #0e2e50
        );

      color: #ffffff;

      font-size:
        clamp(18px, 4vw, 26px);

      font-weight: 850;
      text-align: left;

      transition:
        transform .12s ease,
        background .12s ease,
        border-color .12s ease;
    }

    .answer:hover {
      border-color: #5786a9;
      background:
        linear-gradient(
          145deg,
          #19476f,
          #123657
        );
    }

    .answer:active {
      transform: scale(.985);
    }

    .answer:disabled {
      cursor: default;
    }

    .answer.correct-answer {
      background: #123d2d;
      border-color: #58d69c;
    }

    .answer.wrong-answer {
      background: #47242b;
      border-color: #e36d76;
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
      width: 36px;
      height: 36px;

      flex: 0 0 36px;

      display: grid;
      place-items: center;

      border-radius: 50%;

      font-size: 20px;
      font-weight: 950;
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
      color: #c5d1dc;
      font-size: 14px;
    }

    .correct-result {
      background: #10392b;
      border: 1px solid #2a7255;
    }

    .correct-result .result-icon {
      background: #1d714e;
      color: #a9f4cf;
    }

    .wrong-result {
      background: #45242a;
      border: 1px solid #7d3c46;
    }

    .wrong-result .result-icon {
      background: #7e3944;
      color: #ffd0d0;
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
          #f9da6a,
          #edc64b
        );

      color: #071728;

      font-size: 18px;
      font-weight: 950;
      letter-spacing: .5px;

      box-shadow:
        0 9px 22px rgba(0,0,0,.23);
    }

    .next-button:hover {
      filter: brightness(1.04);
    }

    .mode-section {
      margin-top: 34px;
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

      border: 2px solid #315f83;
      border-radius: 17px;

      background: #0d2d4e;

      color: #bac9d8;

      font-size: 15px;
      font-weight: 950;
      letter-spacing: .4px;
    }

    .mode:hover,
    #resetButton:hover,
    #newButton:hover {
      border-color: #4b789a;
    }

    .mode.active {
      background: #f5d35b;
      border-color: #f5d35b;
      color: #071728;
    }

    .bottom-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
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

      .eyebrow {
        font-size: 11px;
        letter-spacing: 2px;
      }

      h1 {
        font-size: 49px;
        letter-spacing: -2.5px;
      }

      .subtitle {
        margin-top: 17px;
        margin-bottom: 27px;
        font-size: 19px;
      }

      .stats {
        gap: 8px;
        margin-bottom: 24px;
      }

      .stat {
        min-height: 91px;
        border-radius: 19px;
      }

      .stat span {
        font-size: 10px;
        letter-spacing: 1.5px;
      }

      .stat strong {
        font-size: 34px;
      }

      .quiz-card {
        padding: 23px 18px;
        border-radius: 24px;
      }

      .question-label {
        font-size: 12px;
        letter-spacing: 1.5px;
      }

      #question {
        margin-top: 12px;
        font-size: 31px;
      }

      .answer {
        min-height: 68px;
        padding: 14px 17px;
        border-radius: 17px;
        font-size: 19px;
      }

      .mode,
      #resetButton,
      #newButton {
        min-height: 56px;
        border-radius: 16px;
        font-size: 12px;
      }

      .footer-note {
        font-size: 12px;
      }
    }

  `;

  document.head.appendChild(style);

  /* =========================================================
     START
     ========================================================= */

  buildApp();

})();
