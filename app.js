/* Irish Player IQ — full rebuild
   Self-contained static PWA. No framework or build step.
*/
(() => {
"use strict";

const ROSTER_DATA = [{"num": "0", "name": "Tionne Gray", "pos": "DL"}, {"num": "0", "name": "Quincy Porter", "pos": "WR"}, {"num": "1", "name": "Dallas Golden", "pos": "CB"}, {"num": "1", "name": "Jaden Greathouse", "pos": "WR"}, {"num": "2", "name": "Nolan James Jr.", "pos": "RB"}, {"num": "2", "name": "DJ McKinney", "pos": "CB"}, {"num": "3", "name": "Mylan Graham", "pos": "WR"}, {"num": "3", "name": "Jaylen Sneed", "pos": "LB"}, {"num": "4", "name": "Bubba Frazier", "pos": "WR"}, {"num": "4", "name": "Jaiden Ausberry", "pos": "LB"}, {"num": "5", "name": "Cam Williams", "pos": "WR"}, {"num": "5", "name": "Boubacar Traore", "pos": "DL"}, {"num": "6", "name": "Christopher Burgess Jr.", "pos": "DL"}, {"num": "6", "name": "Jordan Faison", "pos": "WR"}, {"num": "7", "name": "Francis Brewu", "pos": "DL"}, {"num": "7", "name": "Ty Washington", "pos": "TE"}, {"num": "8", "name": "Jerome Bettis Jr.", "pos": "WR"}, {"num": "8", "name": "Adon Shuler", "pos": "S"}, {"num": "9", "name": "Brauntae Johnson", "pos": "S"}, {"num": "9", "name": "Teddy Jarrard", "pos": "QB"}, {"num": "10", "name": "Noah Grubbs", "pos": "QB"}, {"num": "10", "name": "Loghan Thomas", "pos": "DL"}, {"num": "11", "name": "Keon Keeley", "pos": "DL"}, {"num": "11", "name": "Devin Fitzgerald", "pos": "WR"}, {"num": "12", "name": "Jayden Sanders", "pos": "CB"}, {"num": "12", "name": "Blake Hebert", "pos": "QB"}, {"num": "13", "name": "Ayden Pouncey", "pos": "CB"}, {"num": "13", "name": "CJ Carr", "pos": "QB"}, {"num": "14", "name": "Ebenezer Ewetade", "pos": "DL"}, {"num": "14", "name": "Micah Gilbert", "pos": "WR"}, {"num": "15", "name": "Brayden Robinson", "pos": "WR"}, {"num": "15", "name": "Leonard Moore", "pos": "CB"}, {"num": "16", "name": "Dylan Faison", "pos": "WR"}, {"num": "16", "name": "Koʻo Kia", "pos": "LB"}, {"num": "17", "name": "Elijah Burress", "pos": "WR"}, {"num": "17", "name": "Brenan Vernon", "pos": "DL"}, {"num": "18", "name": "Kaydon Finley", "pos": "WR"}, {"num": "18", "name": "Erik Schmidt", "pos": "P"}, {"num": "19", "name": "Madden Faraimo", "pos": "LB"}, {"num": "19", "name": "Logan Saldate", "pos": "WR"}, {"num": "20", "name": "Joey O'Brien", "pos": "S"}, {"num": "20", "name": "Jonaz Walton", "pos": "RB"}, {"num": "21", "name": "Khary Adams", "pos": "CB"}, {"num": "21", "name": "Kedren Young", "pos": "RB"}, {"num": "22", "name": "Ethan Long", "pos": "S"}, {"num": "22", "name": "Aneyas Williams", "pos": "RB"}, {"num": "23", "name": "Ja'Kobe Clapper", "pos": "LB"}, {"num": "24", "name": "Mark Zackery IV", "pos": "CB"}, {"num": "24", "name": "Ian Premer", "pos": "TE"}, {"num": "25", "name": "Brandon Logan", "pos": "S"}, {"num": "26", "name": "Chaz Smith", "pos": "CB"}, {"num": "26", "name": "Javian Osborne", "pos": "RB"}, {"num": "27", "name": "Kyngstonn Viliamu-Asa", "pos": "LB"}, {"num": "28", "name": "Luke Talich", "pos": "S"}, {"num": "29", "name": "Christian Gray", "pos": "CB"}, {"num": "30", "name": "Patrick Downes", "pos": "S"}, {"num": "31", "name": "Xavier Southall", "pos": "WR"}, {"num": "32", "name": "Nick Reddish", "pos": "CB"}, {"num": "33", "name": "Matt Jeffery", "pos": "WR"}, {"num": "34", "name": "Drayk Bowen", "pos": "LB"}, {"num": "35", "name": "Spencer Porath", "pos": "K"}, {"num": "35", "name": "Teddy Rezac", "pos": "LB"}, {"num": "36", "name": "Micah Drescher", "pos": "K"}, {"num": "37", "name": "Kurt Smith", "pos": "RB"}, {"num": "38", "name": "Tommy Powlus", "pos": "LB"}, {"num": "39", "name": "Jasper Scaife", "pos": "P"}, {"num": "40", "name": "Dominik Hulak", "pos": "DL"}, {"num": "42", "name": "Cole Mullins", "pos": "DL"}, {"num": "42", "name": "Henry Garrity", "pos": "TE"}, {"num": "43", "name": "Kahanu Kia", "pos": "LB"}, {"num": "44", "name": "Rodney Dunham", "pos": "DL"}, {"num": "46", "name": "Matt Williams", "pos": "RB"}, {"num": "47", "name": "Jason Onye", "pos": "DL"}, {"num": "48", "name": "Chase Young", "pos": "S"}, {"num": "49", "name": "Andrew Kros", "pos": "LS"}, {"num": "50", "name": "Sullivan Garvin", "pos": "OL"}, {"num": "51", "name": "Ben Nichols", "pos": "OL"}, {"num": "52", "name": "Devan Houstan", "pos": "OL"}, {"num": "54", "name": "Anthonie Knapp", "pos": "OL"}, {"num": "55", "name": "Tiki Hola", "pos": "DL"}, {"num": "55", "name": "Chris Terek", "pos": "OL"}, {"num": "56", "name": "Charles Jagusah", "pos": "OL"}, {"num": "56", "name": "Elijah Hughes", "pos": "DL"}, {"num": "57", "name": "Cam Herron", "pos": "OL"}, {"num": "58", "name": "Thomas Davis Jr.", "pos": "LB"}, {"num": "58", "name": "Matty Augustine", "pos": "OL"}, {"num": "59", "name": "Sean Sevillano Jr.", "pos": "DL"}, {"num": "60", "name": "Davion Dixon", "pos": "DL"}, {"num": "60", "name": "Max Anderson", "pos": "OL"}, {"num": "61", "name": "Robbie Wollan", "pos": "OL"}, {"num": "64", "name": "Joe Otting", "pos": "OL"}, {"num": "65", "name": "Grayson McKeogh", "pos": "OL"}, {"num": "66", "name": "Tyler Merrill", "pos": "OL"}, {"num": "67", "name": "Gregory Patrick", "pos": "OL"}, {"num": "68", "name": "Charlie Thom", "pos": "OL"}, {"num": "70", "name": "Ashton Craig", "pos": "OL"}, {"num": "71", "name": "Styles Prescod", "pos": "OL"}, {"num": "74", "name": "Will Black", "pos": "OL"}, {"num": "75", "name": "Sullivan Absher", "pos": "OL"}, {"num": "76", "name": "Guerby Lambert", "pos": "OL"}, {"num": "77", "name": "Peter Jones", "pos": "OL"}, {"num": "78", "name": "Owen Strebig", "pos": "OL"}, {"num": "84", "name": "Preston Fryzel", "pos": "TE"}, {"num": "85", "name": "Jack Larsen", "pos": "TE"}, {"num": "86", "name": "Kaleb Johnson", "pos": "TE"}, {"num": "87", "name": "Cooper Flanagan", "pos": "TE"}, {"num": "88", "name": "James Flanigan", "pos": "TE"}, {"num": "88", "name": "Armel Mukam", "pos": "DL"}, {"num": "89", "name": "Austin Ratigan", "pos": "TE"}, {"num": "90", "name": "Elijah Golden", "pos": "DL"}, {"num": "91", "name": "Gordy Sulfsted", "pos": "DL"}, {"num": "94", "name": "Joe Reiff", "pos": "DL"}, {"num": "95", "name": "Bryce Young", "pos": "DL"}, {"num": "96", "name": "Joseph Vinci", "pos": "LS"}];
const SCHEDULE = [["Sep 6", "Wisconsin", "Lambeau Field", "7:30 PM", "Neutral"], ["Sep 12", "Rice", "Notre Dame Stadium", "3:30 PM", "Home"], ["Sep 19", "Michigan State", "Notre Dame Stadium", "7:30 PM", "Home"], ["Sep 26", "Purdue", "Ross-Ade Stadium", "TBA", "Away"], ["Oct 3", "North Carolina", "Kenan Memorial Stadium", "TBA", "Away"], ["Oct 10", "Stanford", "Notre Dame Stadium", "3:30 PM", "Home"], ["Oct 17", "BYU", "LaVell Edwards Stadium", "TBA", "Away"], ["Oct 31", "Navy", "Gillette Stadium", "12:00 PM", "Neutral"], ["Nov 7", "Miami", "Notre Dame Stadium", "7:30 PM", "Home"], ["Nov 14", "Boston College", "Notre Dame Stadium", "3:30 PM", "Home"], ["Nov 21", "SMU", "Notre Dame Stadium", "7:30 PM", "Home"], ["Nov 28", "Syracuse", "JMA Wireless Dome", "TBA", "Away"]];
const KEY = "ipiq_full_2026_v1";

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };

const state = Object.assign({
  score:0, streak:0, best:0, xp:0, rounds:0, correct:0,
  mastered:{}, numbers:{}, positions:{}, visual:{}, seen:{}, history:[]
}, (()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}})());

let screen = "home";
let mode = "mix";
let current = null;
let currentQuestion = null;
let locked = false;
let round = {active:false, index:0, correct:0, score:0, questions:[]};
let fifty = false;

const POS = {
  QB:"Quarterback", RB:"Running Back", WR:"Wide Receiver", TE:"Tight End",
  OL:"Offensive Line", DL:"Defensive Line", LB:"Linebacker", CB:"Cornerback",
  S:"Safety", K:"Kicker", P:"Punter", LS:"Long Snapper"
};

function save(){ try{localStorage.setItem(KEY, JSON.stringify(state));}catch{} }
function xpLevel(){ return Math.max(1, Math.floor((state.xp||0)/500)+1); }
function masteryCount(obj){ return Object.values(obj||{}).filter(v=>v>=3).length; }
function percent(n,d){ return d ? Math.round(n/d*100) : 0; }
function playerKey(p){ return `${p.num}|${p.name}`; }
function profileSlug(name){
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/jr\./g,"jr").replace(/iv/g,"iv").replace(/['’]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
function photoPath(p){
  return `photos/${profileSlug(p.name)}.jpg`;
}
function photoExistsMarkup(p, alt=true){
  const path = photoPath(p);
  return `<img class="player-photo" src="${path}" alt="${alt?esc(p.name):""}" loading="lazy"
    onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
    <div class="photo-placeholder"><div class="helmet-mark">ND</div><strong>#${esc(p.num)}</strong><span>${esc(p.name)}</span><small>ADD OFFICIAL UNIFORM PHOTO</small></div>`;
}
function record(p, wasCorrect, visual=false){
  const k=playerKey(p);
  state.seen[k]=(state.seen[k]||0)+1;
  if(wasCorrect){
    state.correct++;
    state.streak++;
    state.best=Math.max(state.best,state.streak);
    state.xp += 50 + Math.min(state.streak,10)*5;
    if(visual) state.visual[k]=(state.visual[k]||0)+1;
    else state.mastered[k]=(state.mastered[k]||0)+1;
    state.numbers[p.num]=(state.numbers[p.num]||0)+1;
    state.positions[p.pos]=(state.positions[p.pos]||0)+1;
  }else state.streak=0;
  save();
}
function totalMastered(){return masteryCount(state.mastered)}
function getNumChoices(p){
  const nums=[...new Set(ROSTER_DATA.map(x=>x.num))];
  return shuffle([p.num,...shuffle(nums.filter(x=>x!==p.num)).slice(0,3)]);
}
function getPosChoices(p){
  return shuffle([p.pos,...shuffle(Object.keys(POS).filter(x=>x!==p.pos)).slice(0,3)]);
}
function getNameChoices(p){
  const wrong=shuffle(ROSTER_DATA.filter(x=>x.name!==p.name && !(x.num===p.num&&x.pos===p.pos)).map(x=>x.name));
  return shuffle([p.name,...wrong.slice(0,3)]);
}
function makeQuestion(kind="mix"){
  const p=ROSTER_DATA[Math.floor(Math.random()*ROSTER_DATA.length)];
  const types=kind==="mix"?["numName","nameNum","namePos","photoName","photoNum","photoPos","hidden"]: [kind];
  const type=types[Math.floor(Math.random()*types.length)];
  current=p;
  if(type==="numName") return {type,label:"NUMBER → PLAYER",prompt:`Who wears #${p.num}?`,choices:getNameChoices(p),answer:p.name};
  if(type==="nameNum") return {type,label:"PLAYER → NUMBER",prompt:`What number does ${p.name} wear?`,choices:getNumChoices(p),answer:p.num};
  if(type==="namePos") return {type,label:"PLAYER → POSITION",prompt:`What position does ${p.name} play?`,choices:getPosChoices(p),answer:p.pos};
  if(type==="photoName") return {type,label:"PHOTO → PLAYER",prompt:"WHO IS THIS PLAYER?",choices:getNameChoices(p),answer:p.name,photo:true};
  if(type==="photoNum") return {type,label:"PHOTO → NUMBER",prompt:"WHAT NUMBER DOES HE WEAR?",choices:getNumChoices(p),answer:p.num,photo:true};
  if(type==="photoPos") return {type,label:"PHOTO → POSITION",prompt:"WHAT POSITION DOES HE PLAY?",choices:getPosChoices(p),answer:p.pos,photo:true};
  return {type:"hidden",label:"HIDDEN NUMBER",prompt:`${p.name} — what number does he wear?`,choices:getNumChoices(p),answer:p.num,photo:true,hidden:true};
}

function home(){
  screen="home"; render();
}
function render(){
  document.body.innerHTML = `
  <div class="app-shell">
    <div class="top-glow"></div>
    <header class="brand">
      <div class="nd-mark">ND</div>
      <div class="brand-kicker">IRISH</div>
      <h1>PLAYER IQ</h1>
      <p>KNOW THE IRISH. LIVE THE GAME.</p>
    </header>

    <main id="main"></main>

    <nav class="bottom-nav">
      ${navBtn("home","⌂","HOME")}
      ${navBtn("progress","▥","MY PROGRESS")}
      ${navBtn("games","◉","GAMES")}
      ${navBtn("season","▦","SEASON")}
      ${navBtn("more","•••","MORE")}
    </nav>
  </div>`;
  const main=$("#main");
  if(screen==="home") renderHome(main);
  if(screen==="progress") renderProgress(main);
  if(screen==="games") renderGames(main);
  if(screen==="season") renderSeason(main);
  if(screen==="more") renderMore(main);
  bindGlobal();
}
function navBtn(s,icon,label){
  return `<button class="nav-btn ${screen===s?'active':''}" data-nav="${s}"><b>${icon}</b><span>${label}</span></button>`;
}
function renderHome(root){
  const mastered=totalMastered(), n=ROSTER_DATA.length;
  root.innerHTML=`
    <section class="iq-panel">
      <div class="ring" style="--pct:${percent(mastered,n)}">
        <div><strong>${percent(mastered,n)}%</strong><span>MASTERED</span></div>
      </div>
      <div class="iq-copy">
        <h2>YOUR IRISH IQ</h2>
        <div class="metric"><span>PLAYERS MASTERED</span><b>${mastered} / ${n}</b></div>
        <div class="metric"><span>NUMBERS MASTERED</span><b>${Object.keys(state.numbers).filter(k=>state.numbers[k]>=3).length} / ${new Set(ROSTER_DATA.map(p=>p.num)).size}</b></div>
        <div class="metric"><span>POSITIONS MASTERED</span><b>${Object.keys(state.positions).filter(k=>state.positions[k]>=3).length} / ${Object.keys(POS).length}</b></div>
        <div class="metric"><span>VISUAL RECOGNITION</span><b>${masteryCount(state.visual)} / ${n}</b></div>
      </div>
    </section>
    <div class="section-head"><span>GAME MODES</span><button data-screen="progress">DETAILED STATS ›</button></div>
    <section class="mode-grid">
      ${homeCard("mix","01","QUICK PLAY","MIX-UP","All question types mixed","⚡")}
      ${homeCard("numName","02","ROSTER CHALLENGE","NUMBER → PLAYER","See a number, name the player","#")}
      ${homeCard("nameNum","03","ROSTER CHALLENGE","PLAYER → NUMBER","See a player, recall the number","◈")}
      ${homeCard("namePos","04","POSITION MODE","PLAYER → POSITION","Name the position","♟")}
      ${homeCard("photoName","05","VISUAL IQ","PHOTO → PLAYER","See a uniform photo, name him","◉")}
      ${homeCard("hidden","06","ELITE MODE","HIDDEN NUMBER","Name the player & number","▣")}
    </section>
    <section class="next-game">
      <div><small>NEXT GAME</small><strong>WISCONSIN</strong><span>SUN, SEP 6 • 7:30 PM ET</span><em>LAMBEAU FIELD</em></div>
      <button data-screen="season">SEASON ›</button>
    </section>
  `;
  $$(".mode-card",root).forEach(b=>b.onclick=()=>startGame(b.dataset.mode));
  $$("[data-screen]",root).forEach(b=>b.onclick=()=>{screen=b.dataset.screen;render()});
}
function homeCard(mode,num,kicker,title,desc,icon){
 return `<button class="mode-card" data-mode="${mode}"><div class="mode-num">${num}</div><div class="mode-icon">${icon}</div><div class="mode-text"><small>${kicker}</small><strong>${title}</strong><span>${desc}</span></div><b class="chev">›</b></button>`;
}
function renderProgress(root){
 const mastered=totalMastered();
 const sorted=ROSTER_DATA.map(p=>({p,score:Math.min(99,(state.mastered[playerKey(p)]||0)*25+Math.min(49,(state.seen[playerKey(p)]||0)*4))}))
 .sort((a,b)=>b.score-a.score);
 root.innerHTML=`
 <div class="subhead"><button data-home>‹</button><div><small>MY PROGRESS</small><strong>IRISH IQ</strong></div></div>
 <section class="progress-hero"><div class="big-ring">${percent(mastered,ROSTER_DATA.length)}%</div><div><h2>${mastered} / ${ROSTER_DATA.length}</h2><span>PLAYERS MASTERED</span><b>LEVEL ${xpLevel()} • ${state.xp} XP</b></div></section>
 <div class="tabs"><button class="tab active">PLAYERS</button><button class="tab">NUMBERS</button><button class="tab">POSITIONS</button><button class="tab">VISUAL</button></div>
 <section class="player-list">
 ${sorted.slice(0,20).map(({p,score})=>`<div class="player-row"><div class="mini-photo">${photoExistsMarkup(p,false)}</div><div class="row-copy"><strong>${esc(p.name)}</strong><span>#${p.num} • ${POS[p.pos]||p.pos}</span><em>${score>=75?"MASTERED":score?"IN PROGRESS":"NEW"}</em></div><div class="progress-circle">${score}%</div></div>`).join("")}
 </section>`;
 $$("[data-home]",root).forEach(b=>b.onclick=home);
}
function renderGames(root){
 root.innerHTML=`
 <div class="subhead"><button data-home>‹</button><div><small>GAMES</small><strong>QUICK PLAY</strong></div></div>
 <section class="game-menu">
 ${gameRow("mix","⚡","MIX-UP","All question types mixed")}
 ${gameRow("numName","#","NUMBER → PLAYER","See a number, name the player")}
 ${gameRow("nameNum","◈","PLAYER → NUMBER","See a player, name the number")}
 ${gameRow("namePos","♟","PLAYER → POSITION","See a player, name the position")}
 ${gameRow("photoName","◉","PHOTO → PLAYER","See a uniform photo, name the player")}
 ${gameRow("photoNum","◉","PHOTO → NUMBER","See a uniform photo, name the number")}
 ${gameRow("photoPos","◉","PHOTO → POSITION","See a uniform photo, name the position")}
 ${gameRow("hidden","▣","HIDDEN NUMBER","Name the player & number")}
 </section>`;
 $$("[data-game]",root).forEach(b=>b.onclick=()=>startGame(b.dataset.game));
 $$("[data-home]",root).forEach(b=>b.onclick=home);
}
function gameRow(mode,icon,title,desc){return `<button class="game-row" data-game="${mode}"><i>${icon}</i><span><strong>${title}</strong><small>${desc}</small></span><b>›</b></button>`}
function renderSeason(root){
 root.innerHTML=`
 <div class="subhead"><button data-home>‹</button><div><small>2026–27 SEASON</small><strong>FIGHTING IRISH</strong></div></div>
 <section class="season-cards">
  <div class="season-stat"><small>REGULAR SEASON</small><b>12 GAMES</b><span>7 home • 4 away • 1 neutral</span></div>
  <div class="season-stat"><small>SHAMROCK SERIES</small><b>WISCONSIN</b><span>Sept. 6 • Lambeau Field</span></div>
 </section>
 <div class="section-head"><span>2026 SCHEDULE</span><a href="https://fightingirish.com/sports/football/schedule/season/2026-27/" target="_blank" rel="noopener">OFFICIAL ↗</a></div>
 <section class="schedule">${SCHEDULE.map((g,i)=>`<div class="schedule-row"><span>${g[0]}</span><strong>${g[1]}</strong><small>${g[2]}</small><em>${g[3]}</em><b>${g[4]}</b></div>`).join("")}</section>
 <div class="source-note">Schedule based on Notre Dame's official 2026 football schedule.</div>`;
 $$("[data-home]",root).forEach(b=>b.onclick=home);
}
function renderMore(root){
 root.innerHTML=`
 <div class="subhead"><button data-home>‹</button><div><small>MORE</small><strong>TOOLS & INFO</strong></div></div>
 <section class="more-grid">
  <button data-screen="progress"><b>▥</b><strong>MY PROGRESS</strong><span>Mastery, streaks and XP</span></button>
  <button data-screen="season"><b>▦</b><strong>SEASON</strong><span>Schedule and game prep</span></button>
  <a href="https://fightingirish.com/sports/football/roster/season/2026-27/" target="_blank" rel="noopener"><b>ND</b><strong>OFFICIAL ROSTER</strong><span>Verify roster details</span></a>
  <div class="more-info"><strong>PHOTO LAB</strong><p>Add official uniform photos to the <code>photos</code> folder using the filename shown in the study cards. The app automatically detects them.</p></div>
  <button id="resetAll" class="danger">RESET ALL PROGRESS</button>
 </section>`;
 $$("[data-screen]",root).forEach(b=>b.onclick=()=>{screen=b.dataset.screen;render()});
 $$("[data-home]",root).forEach(b=>b.onclick=home);
 $("#resetAll",root).onclick=()=>{if(confirm("Reset all Irish Player IQ progress?")){localStorage.removeItem(KEY);location.reload()}};
}

function startGame(m){
 mode=m; screen="quiz"; round={active:false,index:0,correct:0,score:0,questions:[]}; fifty=false; renderQuiz();
}
function renderQuiz(){
 document.body.innerHTML=`<div class="quiz-shell"><div class="quiz-top"><button id="quit">‹</button><div><small>${round.active?"MIX-UP":"QUICK PLAY"}</small><strong>${round.active?`QUESTION ${round.index+1} OF 10`:labelFor(mode)}</strong></div><button id="close">×</button></div><div class="quiz-stats"><span>STREAK <b>${state.streak}</b></span><span>SCORE <b>${state.score}</b></span></div><main id="quizMain"></main></div>`;
 $("#quit").onclick=home; $("#close").onclick=home;
 if(round.active) renderRoundQuestion($("#quizMain")); else renderSingle($("#quizMain"));
}
function labelFor(m){return ({mix:"MIX-UP",numName:"NUMBER → PLAYER",nameNum:"PLAYER → NUMBER",namePos:"PLAYER → POSITION",photoName:"PHOTO → PLAYER",photoNum:"PHOTO → NUMBER",photoPos:"PHOTO → POSITION",hidden:"HIDDEN NUMBER"})[m]||"QUICK PLAY"}
function renderSingle(root){
 currentQuestion=makeQuestion(mode);
 root.innerHTML=questionMarkup(currentQuestion);
 bindQuestion(root);
}
function renderRoundQuestion(root){
 if(!round.questions.length) round.questions=Array.from({length:10},()=>makeQuestion("mix"));
 currentQuestion=round.questions[round.index];
 current=currentQuestion._player;
 root.innerHTML=questionMarkup(currentQuestion);
 bindQuestion(root);
}
function questionMarkup(q){
 const p=current;
 let visual=q.photo?`<div class="photo-frame">${photoExistsMarkup(p)}<div class="photo-tag">OFFICIAL PHOTO</div></div>`:"";
 let hidden=q.hidden?`<div class="hidden-number"><span>?</span><small>JERSEY NUMBER HIDDEN</small></div>`:"";
 return `<section class="question-card">
   <div class="q-label">${esc(q.label)}</div>
   ${visual}${hidden}
   <h1>${esc(q.prompt)}</h1>
   <div class="choices">${q.choices.map((c,i)=>`<button class="choice" data-i="${i}">${esc(POS[c]||c)}</button>`).join("")}</div>
   <div id="answerResult"></div>
   <div class="lifelines"><button id="fifty">50/50</button><button id="boost">⓷ STREAK BOOST</button><button id="skip">SKIP</button></div>
 </section>`;
}
function bindQuestion(root){
 $$(".choice",root).forEach(b=>b.onclick=()=>answer(Number(b.dataset.i),root));
 $("#skip",root).onclick=()=>{if(round.active){round.index++; if(round.index>=10)return finishRound();} renderQuiz()};
 $("#fifty",root).onclick=()=>{
   if(fifty)return;
   fifty=true;
   const q=currentQuestion;
   const wrong=$$(".choice",root).filter(b=>b.textContent.trim()!==(POS[q.answer]||q.answer));
   shuffle(wrong).slice(0,2).forEach(b=>{b.disabled=true;b.classList.add("faded")});
 };
 $("#boost",root).onclick=()=>{if(state.streak>0){state.xp+=25;save();$("#boost").textContent="✓ BOOST USED";$("#boost").disabled=true}};
}
function answer(i,root){
 if(locked)return; locked=true;
 const q=currentQuestion;
 const selected=q.choices[i];
 const ok=selected===q.answer;
 $$(".choice",root).forEach(b=>b.disabled=true);
 const btn=$$(".choice",root)[i]; btn.classList.add(ok?"correct":"wrong");
 if(!ok){$$(".choice",root).forEach(b=>{if(b.textContent.trim()===(POS[q.answer]||q.answer))b.classList.add("correct")})}
 record(current,ok,!!q.photo);
 $("#answerResult").innerHTML=`<div class="answer-result ${ok?"good":"bad"}"><strong>${ok?"✓ CORRECT":"✕ NOT QUITE"}</strong><span>${esc(current.name)} • #${esc(current.num)} • ${esc(POS[current.pos]||current.pos)}</span></div>`;
 const next=document.createElement("button"); next.className="continue"; next.textContent=round.active?(round.index===9?"ROUND COMPLETE":"NEXT QUESTION"):"NEXT QUESTION";
 next.onclick=()=>{locked=false;fifty=false;if(round.active){round.index++; if(round.index>=10)finishRound();else renderQuiz()}else renderQuiz()}; root.appendChild(next);
}
function finishRound(){
 round.active=false; screen="roundDone";
 document.body.innerHTML=`<div class="round-done"><div class="check">✓</div><small>ROUND COMPLETE</small><h1>NICE WORK!</h1><p>You answered ${round.correct||state.correct} correctly.</p><div class="done-stats"><div><b>${state.best}</b><span>LONGEST STREAK</span></div><div><b>${state.score}</b><span>SCORE</span></div><div><b>LEVEL ${xpLevel()}</b><span>IRISH IQ</span></div></div><button id="continueHome">CONTINUE</button></div>`;
 $("#continueHome").onclick=home;
}
function renderRound(){}

function bindGlobal(){
 $$(".nav-btn").forEach(b=>b.onclick=()=>{screen=b.dataset.nav;render()});
}
function launch(){
 locked=false;
 render();
}
if ("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
launch();
})();