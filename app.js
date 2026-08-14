/* Irish Player IQ — clean standalone app.js
   No external JSON feeds. No network requests required for startup.
   Designed to run directly from GitHub Pages with index.html loading ./app.js.
*/

const ROSTER = [
  ["0","Tionne Gray","DL"],["0","Quincy Porter","WR"],
  ["1","Dallas Golden","CB"],["1","Jaden Greathouse","WR"],
  ["2","Nolan James Jr.","RB"],["2","DJ McKinney","CB"],
  ["3","Mylan Graham","WR"],["3","Jaylen Sneed","LB"],
  ["4","Bubba Frazier","WR"],["4","Jaiden Ausberry","LB"],
  ["5","Cam Williams","WR"],["5","Boubacar Traore","DL"],
  ["6","Christopher Burgess Jr.","DL"],["6","Jordan Faison","WR"],
  ["7","Francis Brewu","DL"],["7","Ty Washington","TE"],
  ["8","Jerome Bettis Jr.","WR"],["8","Adon Shuler","S"],
  ["9","Brauntae Johnson","S"],["9","Teddy Jarrard","QB"],
  ["10","Noah Grubbs","QB"],["10","Loghan Thomas","DL"],
  ["11","Keon Keeley","DL"],["11","Devin Fitzgerald","WR"],
  ["12","Jayden Sanders","CB"],["12","Blake Hebert","QB"],
  ["13","Ayden Pouncey","CB"],["13","CJ Carr","QB"],
  ["14","Ebenezer Ewetade","DL"],["14","Micah Gilbert","WR"],
  ["15","Brayden Robinson","WR"],["15","Leonard Moore","CB"],
  ["16","Dylan Faison","WR"],["16","Koʿo Kia","LB"],
  ["17","Elijah Burress","WR"],["17","Brenan Vernon","DL"],
  ["18","Kaydon Finley","WR"],["18","Erik Schmidt","P"],
  ["19","Madden Faraimo","LB"],["19","Logan Saldate","WR"],
  ["20","Joey O'Brien","S"],["20","Jonaz Walton","RB"],
  ["21","Khary Adams","CB"],["21","Kedren Young","RB"],
  ["22","Ethan Long","S"],["22","Aneyas Williams","RB"],
  ["23","Ja'Kobe Clapper","LB"],
  ["24","Mark Zackery IV","CB"],["24","Ian Premer","TE"],
  ["25","Brandon Logan","S"],
  ["26","Chaz Smith","CB"],["26","Javian Osborne","RB"],
  ["27","Kyngstonn Viliamu-Asa","LB"],["28","Luke Talich","S"],
  ["29","Christian Gray","CB"],["30","Patrick Downes","S"],
  ["31","Xavier Southall","WR"],["32","Nick Reddish","CB"],
  ["33","Matt Jeffery","WR"],["34","Drayk Bowen","LB"],
  ["35","Spencer Porath","K"],["35","Teddy Rezac","LB"],
  ["36","Micah Drescher","K"],["37","Kurt Smith","RB"],
  ["38","Tommy Powlus","LB"],["39","Jasper Scaife","P"],
  ["40","Dominik Hulak","DL"],["42","Cole Mullins","DL"],
  ["42","Henry Garrity","TE"],["43","Kahanu Kia","LB"],
  ["44","Rodney Dunham","DL"],["46","Matt Williams","RB"],
  ["47","Jason Onye","DL"],["48","Chase Young","S"],
  ["49","Andrew Kros","LS"],["50","Sullivan Garvin","OL"],
  ["51","Ben Nichols","OL"],["52","Devan Houstan","OL"],
  ["54","Anthonie Knapp","OL"],["55","Tiki Hola","DL"],
  ["55","Chris Terek","OL"],["56","Charles Jagusah","OL"],
  ["56","Elijah Hughes","DL"],["57","Cam Herron","OL"],
  ["58","Thomas Davis Jr.","LB"],["58","Matty Augustine","OL"],
  ["59","Sean Sevillano Jr.","DL"],["60","Davion Dixon","DL"],
  ["60","Max Anderson","OL"],["61","Robbie Wollan","OL"],
  ["64","Joe Otting","OL"],["65","Grayson McKeogh","OL"],
  ["66","Tyler Merrill","OL"],["67","Gregory Patrick","OL"],
  ["68","Charlie Thom","OL"],["70","Ashton Craig","OL"],
  ["71","Styles Prescod","OL"],["74","Will Black","OL"],
  ["75","Sullivan Absher","OL"],["76","Guerby Lambert","OL"],
  ["77","Peter Jones","OL"],["78","Owen Strebig","OL"],
  ["84","Preston Fryzel","TE"],["85","Jack Larsen","TE"],
  ["86","Kaleb Johnson","TE"],["87","Cooper Flanagan","TE"],
  ["88","James Flanigan","TE"],["88","Armel Mukam","DL"],
  ["89","Austin Ratigan","TE"],["90","Elijah Golden","DL"],
  ["91","Gordy Sulfsted","DL"],["94","Joe Reiff","DL"],
  ["95","Bryce Young","DL"],["96","Joseph Vinci","LS"]
].map(([num,name,pos]) => ({num,name,pos}));

const state = {
  score: Number(localStorage.getItem("ipiq_score") || 0),
  streak: Number(localStorage.getItem("ipiq_streak") || 0),
  best: Number(localStorage.getItem("ipiq_best") || 0)
};

let current = null;
let mode = "numToName";

function saveState(){
  localStorage.setItem("ipiq_score", state.score);
  localStorage.setItem("ipiq_streak", state.streak);
  localStorage.setItem("ipiq_best", state.best);
}

function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function shuffle(a){
  return [...a].sort(() => Math.random() - 0.5);
}

function pick(){
  current = ROSTER[Math.floor(Math.random() * ROSTER.length)];
  return current;
}

function choicesFor(correct, field){
  const values = ROSTER
    .map(p => p[field])
    .filter((v,i,a) => a.indexOf(v) === i);
  return shuffle([correct, ...shuffle(values.filter(v => v !== correct)).slice(0,3)]);
}

function render(){
  document.body.innerHTML = `
    <main class="screen">
      <div class="eyebrow">NOTRE DAME FOOTBALL • 2026–27</div>
      <h1>IRISH PLAYER IQ</h1>

      <div class="stats">
        <span>Score <b>${state.score}</b></span>
        <span>Streak <b>${state.streak}</b></span>
        <span>Best <b>${state.best}</b></span>
      </div>

      <section class="card">
        <div class="small">MEMORIZE THE ROSTER</div>
        <h2>${questionText()}</h2>
        <div class="answers">
          ${questionChoices().map((x,i) =>
            `<button class="answer" data-i="${i}">${esc(x)}</button>`
          ).join("")}
        </div>
        <div id="result"></div>
        <button class="next" id="next" style="display:none">NEXT QUESTION</button>
      </section>

      <section class="modes">
        <button data-mode="numToName"># → NAME</button>
        <button data-mode="nameToNum">NAME → #</button>
        <button data-mode="nameToPos">NAME → POSITION</button>
        <button data-mode="numToPos"># → POSITION</button>
      </section>

      <p class="note">Roster is embedded in the app, so the quiz does not depend on external data loading.</p>
    </main>
  `;

  document.querySelectorAll(".answer").forEach(b => {
    b.addEventListener("click", () => answer(Number(b.dataset.i)));
  });

  document.querySelector("#next").addEventListener("click", newQuestion);

  document.querySelectorAll("[data-mode]").forEach(b => {
    b.addEventListener("click", () => {
      mode = b.dataset.mode;
      newQuestion();
    });
  });
}

function questionText(){
  if(mode === "numToName") return `Who wears #${current.num}?`;
  if(mode === "nameToNum") return `What number does ${current.name} wear?`;
  if(mode === "nameToPos") return `What position does ${current.name} play?`;
  return `What position wears #${current.num}?`;
}

function questionChoices(){
  if(mode === "numToName"){
    return choicesFor(current.name, "name");
  }
  if(mode === "nameToNum"){
    return choicesFor(current.num, "num");
  }
  return choicesFor(current.pos, "pos");
}

function answer(index){
  const buttons = [...document.querySelectorAll(".answer")];
  const selected = buttons[index].textContent;
  let correct;

  if(mode === "numToName") correct = current.name;
  else if(mode === "nameToNum") correct = current.num;
  else correct = current.pos;

  buttons.forEach(b => b.disabled = true);

  const result = document.querySelector("#result");

  if(selected === correct){
    state.score++;
    state.streak++;
    state.best = Math.max(state.best, state.streak);
    result.innerHTML = `<div class="correct">✓ CORRECT — ${esc(current.name)} #${esc(current.num)}</div>`;
  }else{
    state.streak = 0;
    result.innerHTML = `<div class="wrong">✗ NOT QUITE — ${esc(current.name)} is #${esc(current.num)} (${esc(current.pos)})</div>`;
  }

  saveState();
  document.querySelector("#next").style.display = "block";
  document.querySelector(".stats").innerHTML = `
    <span>Score <b>${state.score}</b></span>
    <span>Streak <b>${state.streak}</b></span>
    <span>Best <b>${state.best}</b></span>
  `;
}

function newQuestion(){
  pick();
  render();
}

const style = document.createElement("style");
style.textContent = `
  *{box-sizing:border-box}
  html,body{margin:0;min-height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  body{background:linear-gradient(145deg,#02101f,#092746);color:#fff}
  .screen{min-height:100vh;padding:55px 20px 35px;max-width:620px;margin:auto}
  .eyebrow{font-size:12px;letter-spacing:2px;color:#9eafc2;font-weight:800;text-align:center}
  h1{text-align:center;color:#f4d35e;font-size:38px;line-height:1.05;margin:12px 0 22px;font-weight:900}
  .stats{display:flex;justify-content:center;gap:10px;margin-bottom:18px}
  .stats span{background:#102d4d;border:1px solid #2b4968;border-radius:14px;padding:9px 13px;color:#b9c9d9;font-size:13px}
  .stats b{color:#fff;margin-left:4px}
  .card{background:rgba(255,255,255,.06);border:1px solid #2b4968;border-radius:24px;padding:22px;box-shadow:0 14px 45px rgba(0,0,0,.25)}
  .small{color:#f4d35e;font-size:12px;font-weight:900;letter-spacing:1.5px}
  h2{font-size:27px;line-height:1.15;margin:10px 0 20px}
  .answers{display:grid;gap:11px}
  button{font:inherit}
  .answer,.modes button,.next{border:1px solid #496783;border-radius:14px;padding:14px 12px;background:#102f50;color:#fff;font-weight:700}
  .answer:active,.modes button:active,.next:active{transform:scale(.98)}
  .answer:disabled{opacity:.75}
  .correct,.wrong{margin-top:15px;padding:13px;border-radius:12px;font-weight:800}
  .correct{background:#123d2c;color:#9ff0c8}
  .wrong{background:#452329;color:#ffb0b0}
  .next{display:block;width:100%;margin-top:14px;background:#f4d35e;color:#061425;border:0}
  .modes{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:16px}
  .modes button{font-size:12px;padding:11px}
  .note{text-align:center;color:#8195a9;font-size:12px;line-height:1.4;margin:18px 15px}
`;
document.head.appendChild(style);

try{
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", newQuestion);
  }else{
    newQuestion();
  }
}catch(e){
  document.body.innerHTML = `<div style="padding:30px;color:white;background:#061321;min-height:100vh">
    <h2>Irish Player IQ</h2>
    <p>The app could not start. Please refresh the page.</p>
  </div>`;
}

