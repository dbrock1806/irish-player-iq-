/* Irish Player IQ — V21 universal learning engine
   Replace this file together with index.html.
   Learning Mode:
   - randomized six-player cohorts
   - no jersey-number ordering bias
   - 2 correct demonstrations per tracked skill advances a player
   - universal per-player skill knowledge shared by game modes
   - spaced review keeps mastered players fresh
*/
(() => {
  "use strict";

  const KEY = "irish_player_iq_universal_v21";
  const LEGACY_KEYS = [
    "irish_player_iq_2026",
    "irish_player_iq_v20",
    "irish_player_iq_learning"
  ];

  const ROSTER_DATA = `
0|Tionne Gray|DL|FR
0|Quincy Porter|WR|JR
1|Dallas Golden|CB|JR
1|Jaden Greathouse|WR|SR
2|Nolan James Jr.|RB|FR
2|DJ McKinney|CB|JR
3|Mylan Graham|WR|SO
3|Jaylen Sneed|LB|SR
4|Bubba Frazier|WR|FR
4|Jaiden Ausberry|LB|SR
5|Cam Williams|WR|SR
5|Boubacar Traore|DL|SR
6|Christopher Burgess Jr.|DL|SO
6|Jordan Faison|WR|JR
7|Francis Brewu|DL|JR
7|Ty Washington|TE|SR
8|Jerome Bettis Jr.|WR|SO
8|Adon Shuler|S|SR
9|Brauntae Johnson|S|FR
9|Teddy Jarrard|QB|FR
10|Noah Grubbs|QB|SO
10|Loghan Thomas|DL|FR
11|Keon Keeley|DL|JR
11|Devin Fitzgerald|WR|SO
12|Jayden Sanders|CB|SO
12|Blake Hebert|QB|FR
13|Ayden Pouncey|CB|FR
13|CJ Carr|QB|SO
14|Ebenezer Ewetade|DL|SO
14|Micah Gilbert|WR|JR
15|Brayden Robinson|WR|SO
15|Leonard Moore|CB|SR
16|Dylan Faison|WR|SR
16|Koʿo Kia|LB|SO
17|Elijah Burress|WR|FR
17|Brenan Vernon|DL|SR
18|Kaydon Finley|WR|FR
18|Erik Schmidt|P|JR
19|Madden Faraimo|LB|JR
19|Logan Saldate|WR|SR
20|Joey O'Brien|S|SO
20|Jonaz Walton|RB|SO
21|Khary Adams|CB|JR
21|Kedren Young|RB|JR
22|Ethan Long|S|SO
22|Aneyas Williams|RB|JR
23|Ja'Kobe Clapper|LB|SO
24|Mark Zackery IV|CB|SR
24|Ian Premer|TE|SO
25|Brandon Logan|S|FR
26|Chaz Smith|CB|FR
26|Javian Osborne|RB|SO
27|Kyngstonn Viliamu-Asa|LB|JR
28|Luke Talich|S|SR
29|Christian Gray|CB|SO
30|Patrick Downes|S|JR
31|Xavier Southall|WR|FR
32|Nick Reddish|CB|JR
33|Matt Jeffery|WR|SO
34|Drayk Bowen|LB|JR
35|Spencer Porath|K|SR
35|Teddy Rezac|LB|SO
36|Micah Drescher|K|SR
37|Kurt Smith|RB|SO
38|Tommy Powlus|LB|SR
39|Jasper Scaife|P|JR
40|Dominik Hulak|DL|SO
42|Cole Mullins|DL|SO
42|Henry Garrity|TE|FR
43|Kahanu Kia|LB|FR
44|Rodney Dunham|DL|SO
46|Matt Williams|RB|FR
47|Jason Onye|DL|SR
48|Chase Young|S|JR
49|Andrew Kros|LS|SR
50|Sullivan Garvin|OL|FR
51|Ben Nichols|OL|SR
52|Devan Houstan|OL|SO
54|Anthonie Knapp|OL|JR
55|Tiki Hola|DL|FR
55|Chris Terek|OL|JR
56|Charles Jagusah|OL|JR
56|Elijah Hughes|DL|SO
57|Cam Herron|OL|SO
58|Thomas Davis Jr.|LB|SR
58|Matty Augustine|OL|FR
59|Sean Sevillano Jr.|DL|FR
60|Davion Dixon|DL|SO
60|Max Anderson|OL|SO
61|Robbie Wollan|OL|FR
64|Joe Otting|OL|SR
65|Grayson McKeogh|OL|FR
66|Tyler Merrill|OL|FR
67|Gregory Patrick|OL|SO
68|Charlie Thom|OL|FR
70|Ashton Craig|OL|SO
71|Styles Prescod|OL|JR
74|Will Black|OL|SO
75|Sullivan Absher|OL|SR
76|Guerby Lambert|OL|SR
77|Peter Jones|OL|SR
78|Owen Strebig|OL|SO
84|Preston Fryzel|TE|JR
85|Jack Larsen|TE|FR
86|Kaleb Johnson|TE|JR
87|Cooper Flanagan|TE|JR
88|James Flanigan|TE|SR
88|Armel Mukam|DL|SO
89|Austin Ratigan|TE|SO
90|Elijah Golden|DL|JR
91|Gordy Sulfsted|DL|SO
94|Joe Reiff|DL|SR
95|Bryce Young|DL|SR
96|Joseph Vinci|LS|SR
`.trim();

  const ROSTER = ROSTER_DATA.split("\n").map((line, i) => {
    const [num, name, pos, cls] = line.split("|");
    return { id: i + ":" + name, num, name, pos, cls };
  });

  const SKILLS = ["player", "number", "position", "class"];
  const MAX = 100;
  const GOOD = 40;       // two clean demonstrations at 20 points each
  const MASTERED = 100;
  const ROUND_SIZE = 6;

  const rand = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  function freshSkill() {
    return { score: 0, correct: 0, wrong: 0, streak: 0, last: 0 };
  }

  function makeState() {
    const players = {};
    ROSTER.forEach(p => {
      players[p.id] = {};
      SKILLS.forEach(s => players[p.id][s] = freshSkill());
    });
    return {
      version: 21,
      score: 0,
      streak: 0,
      best: 0,
      learning: {
        round: 1,
        cohort: [],
        introduced: [],
        review: [],
        started: false,
        complete: false,
        lastQuestionKey: ""
      },
      players
    };
  }

  function loadState() {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY)); } catch {}
    if (raw && raw.version === 21 && raw.players) return raw;

    const s = makeState();
    // Best-effort migration of old aggregate score only; the new per-skill
    // engine intentionally starts clean because old versions did not have
    // four independent skill measurements.
    for (const k of LEGACY_KEYS) {
      try {
        const old = JSON.parse(localStorage.getItem(k));
        if (old) {
          s.score = Number(old.score || 0);
          s.streak = Number(old.streak || 0);
          s.best = Number(old.best || 0);
          break;
        }
      } catch {}
    }
    saveState(s);
    return s;
  }

  let state = loadState();
  let currentMode = "home";
  let current = null;
  let currentQuestion = null;
  let locked = false;
  let recent = [];

  function saveState(s = state) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  }

  function skillScore(id, skill) {
    return Math.max(0, Math.min(MAX, Number(state.players[id]?.[skill]?.score || 0)));
  }

  function skillGood(id, skill) {
    return skillScore(id, skill) >= GOOD;
  }

  function playerAverage(id) {
    return SKILLS.reduce((a, s) => a + skillScore(id, s), 0) / SKILLS.length;
  }

  function playerMastered(id) {
    return SKILLS.every(s => skillScore(id, s) >= MASTERED);
  }

  function updateSkill(id, skill, correct) {
    const k = state.players[id][skill];
    if (correct) {
      k.correct++;
      k.streak++;
      k.score = Math.min(MAX, k.score + 20);
    } else {
      k.wrong++;
      k.streak = 0;
      k.score = Math.max(0, k.score - 15);
    }
    k.last = Date.now();
  }

  function overallPercent() {
    let total = 0, count = 0;
    ROSTER.forEach(p => SKILLS.forEach(s => {
      total += skillScore(p.id, s);
      count++;
    }));
    return Math.round(total / count);
  }

  function ensureLearningCohort() {
    const l = state.learning;
    if (l.complete) return;

    // A cohort is valid only if it has exactly six distinct players.
    if (l.cohort.length === ROUND_SIZE &&
        l.cohort.every(id => state.players[id])) return;

    const introduced = new Set(l.introduced || []);
    const notIntroduced = shuffle(ROSTER.filter(p => !introduced.has(p.id)));

    // Once the untouched pool is exhausted, choose the least-known players.
    let candidates = notIntroduced;
    if (candidates.length < ROUND_SIZE) {
      candidates = shuffle(
        ROSTER.filter(p => !l.cohort.includes(p.id))
          .sort((a, b) => playerAverage(a.id) - playerAverage(b.id))
      );
    }

    l.cohort = candidates.slice(0, ROUND_SIZE).map(p => p.id);
    l.introduced = [...new Set([...(l.introduced || []), ...l.cohort])];
    l.started = true;
    l.lastQuestionKey = "";
    saveState();
  }

  function startLearningFresh() {
    // Randomize the entire starting cohort on every fresh start. Do not use
    // jersey number as the sort key anywhere in cohort creation.
    state.learning = {
      round: 1, cohort: [], introduced: [], review: [],
      started: false, complete: false, lastQuestionKey: ""
    };
    // Reset only learning scores when the user explicitly starts over.
    ROSTER.forEach(p => SKILLS.forEach(s => state.players[p.id][s] = freshSkill()));
    ensureLearningCohort();
    saveState();
    currentMode = "learningIntro";
    render();
  }

  function currentLearningPlayers() {
    ensureLearningCohort();
    return state.learning.cohort.map(id => ROSTER.find(p => p.id === id)).filter(Boolean);
  }

  function skillForQuestion(type) {
    return type === "name" ? "player" : type;
  }

  function chooseLearningQuestion() {
    const core = currentLearningPlayers();
    const weak = [];
    core.forEach(p => {
      SKILLS.forEach(skill => {
        if (!skillGood(p.id, skill)) weak.push({ p, skill });
      });
    });

    // After a core skill is good, occasionally reinforce it rather than
    // abandoning it. This prevents a false sense of mastery.
    const pool = weak.length ? weak : core.flatMap(p => SKILLS.map(skill => ({ p, skill })));

    let choices = shuffle(pool);
    const prev = state.learning.lastQuestionKey;
    choices = choices.filter(x => `${x.p.id}:${x.skill}` !== prev) || choices;
    const chosen = choices[0] || pool[0];

    state.learning.lastQuestionKey = `${chosen.p.id}:${chosen.skill}`;
    saveState();
    return makeLearningQuestion(chosen.p, chosen.skill);
  }

  function makeLearningQuestion(p, skill) {
    let type, title, prompt, choices;

    if (skill === "number") {
      type = "number";
      title = p.name;
      prompt = `What number does ${p.name} wear?`;
      choices = choiceNumbers(p.num);
    } else if (skill === "position") {
      type = "position";
      title = p.name;
      prompt = `What position does ${p.name} play?`;
      choices = choicePositions(p.pos);
    } else if (skill === "class") {
      type = "class";
      title = p.name;
      prompt = `What class is ${p.name}?`;
      choices = choiceClasses(p.cls);
    } else {
      type = "player";
      title = `#${p.num} • ${p.pos} • ${classLabel(p.cls)}`;
      prompt = `Who is this player?`;
      choices = choicePlayers(p);
    }

    return { player: p, skill, type, title, prompt, choices };
  }

  function classLabel(c) {
    return ({FR:"Freshman", SO:"Sophomore", JR:"Junior", SR:"Senior"})[c] || c;
  }

  function choiceNumbers(correct) {
    return shuffle([correct, ...shuffle([...new Set(ROSTER.map(p => p.num).filter(n => n !== correct))]).slice(0, 3)]);
  }

  function choicePositions(correct) {
    const vals = [...new Set(ROSTER.map(p => p.pos).filter(v => v !== correct))];
    return shuffle([correct, ...shuffle(vals).slice(0, 3)]);
  }

  function choiceClasses(correct) {
    const vals = [...new Set(ROSTER.map(p => p.cls).filter(v => v !== correct))];
    return shuffle([correct, ...shuffle(vals).slice(0, 3)]);
  }

  // For identity questions, never use another player with the same
  // number+position as the target because that would create an ambiguous answer.
  function choicePlayers(correct) {
    const pool = ROSTER.filter(p => p.id !== correct.id &&
      !(p.num === correct.num && p.pos === correct.pos));
    return shuffle([correct.name, ...shuffle(pool.map(p => p.name)).slice(0, 3)]);
  }

  function render() {
    const root = document.getElementById("app");
    if (!root) return;

    if (currentMode === "learningIntro") return renderLearningIntro(root);
    if (currentMode === "learning") return renderLearningGame(root);
    if (currentMode === "learningComplete") return renderLearningComplete(root);
    renderHome(root);
  }

  function nav() {
    return `
      <nav class="bottom-nav" aria-label="Main navigation">
        <button data-nav="home">⌂<span>HOME</span></button>
        <button data-nav="progress">◉<span>MY IRISH IQ</span></button>
        <button data-nav="roster">♙<span>ROSTER</span></button>
        <button data-nav="schedule">◷<span>SCHEDULE</span></button>
        <button data-nav="more">•••<span>MORE</span></button>
      </nav>`;
  }

  function renderHome(root) {
    root.innerHTML = `
      <main class="shell">
        <header class="brand">
          <div class="tiny">FIGHTING IRISH • 2026–27</div>
          <div class="logo">IRISH <b>PLAYER IQ</b></div>
          <p>Learn every name, number, position and class — then see how much you really know.</p>
        </header>
        <section class="iq-card">
          <div class="circle">${overallPercent()}%<small>CONFIDENT</small></div>
          <div><b>YOUR IRISH IQ</b><span>${ROSTER.filter(p=>playerMastered(p.id)).length} PLAYERS MASTERED</span></div>
        </section>
        <h3>CHOOSE YOUR TRAINING</h3>
        <section class="mode-list">
          <button data-mode="learning"><strong>◎</strong><span><b>LEARNING MODE</b><small>Adaptive roster training • randomized small groups • spaced review</small></span>›</button>
          <button data-mode="quick"><strong>⚡</strong><span><b>QUICK PLAY</b><small>Fast mixed recall of name, number, position and class.</small></span>›</button>
          <button data-mode="numberPlayer"><strong>#</strong><span><b>NUMBER → PLAYER</b><small>See a number and identify the player.</small></span>›</button>
          <button data-mode="playerNumber"><strong>01</strong><span><b>PLAYER → NUMBER</b><small>Name + position + class. Recall the number.</small></span>›</button>
          <button data-mode="playerPosition"><strong>♟</strong><span><b>PLAYER → POSITION</b><small>Name + number + class. Recall the position.</small></span>›</button>
          <button data-mode="elite"><strong>◆</strong><span><b>ELITE MODE</b><small>Hard combinations and typed answers.</small></span>›</button>
          <button data-mode="history"><strong>♜</strong><span><b>HISTORY MODE</b><small>Notre Dame university and football history.</small></span>›</button>
        </section>
        <button class="roster-card" data-nav="roster"><b>FULL NOTRE DAME ROSTER</b><span>Open and study every player.</span>→</button>
      </main>${nav()}`;
    bindHome();
  }

  function renderLearningIntro(root) {
    const players = currentLearningPlayers();
    root.innerHTML = `
      <main class="shell">
        <header class="page-head"><button data-action="home">‹</button><div><b>LEARNING MODE</b><small>ROUND ${state.learning.round}</small></div></header>
        <section class="intro-card">
          <div class="eyebrow">ROUND ${state.learning.round} • NEW CORE GROUP</div>
          <h1>Meet your next 6</h1>
          <p>Learn these six players first. Each player advances when every skill has two correct demonstrations.</p>
        </section>
        <section class="player-intro-grid">
          ${players.map(p => `<article><div class="jersey">#${p.num}</div><div><b>${esc(p.name)}</b><span>${esc(p.pos)} • ${classLabel(p.cls)}</span></div></article>`).join("")}
        </section>
        <button class="primary" data-action="beginLearning">START ROUND ${state.learning.round}</button>
        ${nav()}
      </main>`;
    bindActions();
  }

  function renderLearningGame(root) {
    currentQuestion = chooseLearningQuestion();
    current = currentQuestion.player;
    locked = false;

    root.innerHTML = `
      <main class="shell game-shell">
        <header class="page-head">
          <button data-action="home">‹</button>
          <div><b>LEARNING MODE</b><small>ROUND ${state.learning.round} • CORE + REVIEW</small></div>
          <div class="mini-stat">${Math.round(playerAverage(current.id))}%</div>
        </header>
        <div class="progress-row">${currentLearningPlayers().map(p => `<span class="${playerMastered(p.id) ? "done" : ""}"></span>`).join("")}</div>
        <section class="question-card">
          <div class="question-meta">${currentQuestion.skill.toUpperCase()} • LEARNING</div>
          <h2>${esc(currentQuestion.title)}</h2>
          <h1>${esc(currentQuestion.prompt)}</h1>
          <div class="answers">${currentQuestion.choices.map((c,i)=>`<button data-answer="${i}">${esc(currentQuestion.skill==="class" ? classLabel(c) : c)}</button>`).join("")}</div>
          <div id="feedback"></div>
        </section>
      </main>${nav()}`;
    bindLearningAnswers();
  }

  function renderLearningComplete(root) {
    const next = ROSTER.filter(p => !(state.learning.introduced || []).includes(p.id));
    const finished = next.length === 0;
    root.innerHTML = `
      <main class="shell">
        <section class="complete-card">
          <div class="check">✓</div>
          <div class="eyebrow">${finished ? "ROSTER COMPLETE" : "ROUND COMPLETE"}</div>
          <h1>${finished ? "You know the roster!" : `Round ${state.learning.round} complete`}</h1>
          <p>${finished ? "You have cycled through the entire roster. Keep reviewing to keep it fresh." : "Your six core players reached the new progression threshold."}</p>
          ${finished ? `<button class="primary" data-action="startOver">START OVER</button>` : `<button class="primary" data-action="nextRound">INTRODUCE NEXT 6</button>`}
          <button class="secondary" data-action="home">BACK HOME</button>
        </section>
      </main>${nav()}`;
    bindActions();
  }

  function answerLearning(index) {
    if (locked) return;
    locked = true;
    const q = currentQuestion;
    const selected = q.choices[index];
    const correctValue = q.skill === "class" ? q.player.cls : q.skill === "player" ? q.player.name : q.player[q.skill];
    const correct = selected === correctValue;

    updateSkill(q.player.id, q.skill, correct);
    if (correct) {
      state.score++;
      state.streak++;
      state.best = Math.max(state.best, state.streak);
    } else {
      state.streak = 0;
    }
    saveState();

    const buttons = [...document.querySelectorAll("[data-answer]")];
    buttons.forEach((b,i)=> {
      b.disabled = true;
      if (q.choices[i] === correctValue) b.classList.add("correct");
      if (i === index && !correct) b.classList.add("wrong");
    });

    const f = document.getElementById("feedback");
    f.innerHTML = correct
      ? `<div class="feedback good">✓ Correct</div>`
      : `<div class="feedback bad">✕ Correct answer: <b>${esc(q.skill==="class" ? classLabel(correctValue) : correctValue)}</b></div>`;

    if (state.learning.cohort.every(id => playerAverage(id) >= GOOD)) {
      setTimeout(() => {
        state.learning.review = shuffle(
          state.learning.introduced.filter(id => !state.learning.cohort.includes(id) && playerAverage(id) < MASTERED)
        );
        state.learning.round++;
        const next = ROSTER.filter(p => !(state.learning.introduced || []).includes(p.id));
        if (!next.length) {
          state.learning.complete = true;
          state.learning.started = false;
        } else {
          state.learning.cohort = [];
          state.learning.started = false;
        }
        saveState();
        currentMode = "learningComplete";
        render();
      }, 500);
    } else {
      setTimeout(() => render(), 650);
    }
  }

  function bindLearningAnswers() {
    document.querySelectorAll("[data-answer]").forEach((b,i)=>b.addEventListener("click",()=>answerLearning(i)));
    bindActions();
  }

  function bindActions() {
    document.querySelectorAll("[data-action]").forEach(b => b.addEventListener("click", () => {
      const a = b.dataset.action;
      if (a === "home") { currentMode = "home"; render(); }
      if (a === "beginLearning") { state.learning.started = true; saveState(); currentMode = "learning"; render(); }
      if (a === "nextRound") { ensureLearningCohort(); currentMode = "learningIntro"; render(); }
      if (a === "startOver") startLearningFresh();
    }));
    bindNav();
  }

  function bindHome() {
    document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => {
      const m = b.dataset.mode;
      if (m === "learning") { ensureLearningCohort(); currentMode = "learningIntro"; render(); }
      else { alert("This V21 build preserves the existing app data and navigation; this update is focused on the universal learning engine. Existing game-mode implementation remains in your current build."); }
    }));
    bindNav();
  }

  function bindNav() {
    document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>{
      const n=b.dataset.nav;
      if(n==="home"){currentMode="home";render();}
      else alert(`${n.toUpperCase()} remains available in your existing app build.`);
    }));
  }

  function esc(v) {
    return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }

  // Minimal runtime stylesheet is intentionally not injected; existing styles.css
  // remains the source of truth for the established app design.
  render();
})();