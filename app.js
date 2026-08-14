/* IRISH PLAYER IQ — standalone GitHub Pages app
   No frameworks. No external APIs. No service worker.
   Roster identity fields verified from Notre Dame's 2026-27 roster.
*/
(() => {
"use strict";

const ROSTER = [
  {num:"0",name:'Tionne Gray',pos:"DL"},
  {num:"0",name:'Quincy Porter',pos:"WR"},
  {num:"1",name:'Dallas Golden',pos:"CB"},
  {num:"1",name:'Jaden Greathouse',pos:"WR"},
  {num:"2",name:'Nolan James Jr.',pos:"RB"},
  {num:"2",name:'DJ McKinney',pos:"CB"},
  {num:"3",name:'Mylan Graham',pos:"WR"},
  {num:"3",name:'Jaylen Sneed',pos:"LB"},
  {num:"4",name:'Bubba Frazier',pos:"WR"},
  {num:"4",name:'Jaiden Ausberry',pos:"LB"},
  {num:"5",name:'Cam Williams',pos:"WR"},
  {num:"5",name:'Boubacar Traore',pos:"DL"},
  {num:"6",name:'Christopher Burgess Jr.',pos:"DL"},
  {num:"6",name:'Jordan Faison',pos:"WR"},
  {num:"7",name:'Francis Brewu',pos:"DL"},
  {num:"7",name:'Ty Washington',pos:"TE"},
  {num:"8",name:'Jerome Bettis Jr.',pos:"WR"},
  {num:"8",name:'Adon Shuler',pos:"S"},
  {num:"9",name:'Brauntae Johnson',pos:"S"},
  {num:"9",name:'Teddy Jarrard',pos:"QB"},
  {num:"10",name:'Noah Grubbs',pos:"QB"},
  {num:"10",name:'Loghan Thomas',pos:"DL"},
  {num:"11",name:'Keon Keeley',pos:"DL"},
  {num:"11",name:'Devin Fitzgerald',pos:"WR"},
  {num:"12",name:'Jayden Sanders',pos:"CB"},
  {num:"12",name:'Blake Hebert',pos:"QB"},
  {num:"13",name:'Ayden Pouncey',pos:"CB"},
  {num:"13",name:'CJ Carr',pos:"QB"},
  {num:"14",name:'Ebenezer Ewetade',pos:"DL"},
  {num:"14",name:'Micah Gilbert',pos:"WR"},
  {num:"15",name:'Brayden Robinson',pos:"WR"},
  {num:"15",name:'Leonard Moore',pos:"CB"},
  {num:"16",name:'Dylan Faison',pos:"WR"},
  {num:"16",name:"Ko'o Kia",pos:"LB"},
  {num:"17",name:'Elijah Burress',pos:"WR"},
  {num:"17",name:'Brenan Vernon',pos:"DL"},
  {num:"18",name:'Kaydon Finley',pos:"WR"},
  {num:"18",name:'Erik Schmidt',pos:"P"},
  {num:"19",name:'Madden Faraimo',pos:"LB"},
  {num:"19",name:'Logan Saldate',pos:"WR"},
  {num:"20",name:"Joey O'Brien",pos:"S"},
  {num:"20",name:'Jonaz Walton',pos:"RB"},
  {num:"21",name:'Khary Adams',pos:"CB"},
  {num:"21",name:'Kedren Young',pos:"RB"},
  {num:"22",name:'Ethan Long',pos:"S"},
  {num:"22",name:'Aneyas Williams',pos:"RB"},
  {num:"23",name:"Ja'Kobe Clapper",pos:"LB"},
  {num:"24",name:'Mark Zackery IV',pos:"CB"},
  {num:"24",name:'Ian Premer',pos:"TE"},
  {num:"25",name:'Brandon Logan',pos:"S"},
  {num:"26",name:'Chaz Smith',pos:"CB"},
  {num:"26",name:'Javian Osborne',pos:"RB"},
  {num:"27",name:'Kyngstonn Viliamu-Asa',pos:"LB"},
  {num:"28",name:'Luke Talich',pos:"S"},
  {num:"29",name:'Christian Gray',pos:"CB"},
  {num:"30",name:'Patrick Downes',pos:"S"},
  {num:"31",name:'Xavier Southall',pos:"WR"},
  {num:"32",name:'Nick Reddish',pos:"CB"},
  {num:"33",name:'Matt Jeffery',pos:"WR"},
  {num:"34",name:'Drayk Bowen',pos:"LB"},
  {num:"35",name:'Spencer Porath',pos:"K"},
  {num:"35",name:'Teddy Rezac',pos:"LB"},
  {num:"36",name:'Micah Drescher',pos:"K"},
  {num:"37",name:'Kurt Smith',pos:"RB"},
  {num:"38",name:'Tommy Powlus',pos:"LB"},
  {num:"39",name:'Jasper Scaife',pos:"P"},
  {num:"40",name:'Dominik Hulak',pos:"DL"},
  {num:"42",name:'Cole Mullins',pos:"DL"},
  {num:"42",name:'Henry Garrity',pos:"TE"},
  {num:"43",name:'Kahanu Kia',pos:"LB"},
  {num:"44",name:'Rodney Dunham',pos:"DL"},
  {num:"46",name:'Matt Williams',pos:"RB"},
  {num:"47",name:'Jason Onye',pos:"DL"},
  {num:"48",name:'Chase Young',pos:"S"},
  {num:"49",name:'Andrew Kros',pos:"LS"},
  {num:"50",name:'Sullivan Garvin',pos:"OL"},
  {num:"51",name:'Ben Nichols',pos:"OL"},
  {num:"52",name:'Devan Houstan',pos:"OL"},
  {num:"54",name:'Anthonie Knapp',pos:"OL"},
  {num:"55",name:'Tiki Hola',pos:"DL"},
  {num:"55",name:'Chris Terek',pos:"OL"},
  {num:"56",name:'Charles Jagusah',pos:"OL"},
  {num:"56",name:'Elijah Hughes',pos:"DL"},
  {num:"57",name:'Cam Herron',pos:"OL"},
  {num:"58",name:'Thomas Davis Jr.',pos:"LB"},
  {num:"58",name:'Matty Augustine',pos:"OL"},
  {num:"59",name:'Sean Sevillano Jr.',pos:"DL"},
  {num:"60",name:'Davion Dixon',pos:"DL"},
  {num:"60",name:'Max Anderson',pos:"OL"},
  {num:"61",name:'Robbie Wollan',pos:"OL"},
  {num:"64",name:'Joe Otting',pos:"OL"},
  {num:"65",name:'Grayson McKeogh',pos:"OL"},
  {num:"66",name:'Tyler Merrill',pos:"OL"},
  {num:"67",name:'Gregory Patrick',pos:"OL"},
  {num:"68",name:'Charlie Thom',pos:"OL"},
  {num:"70",name:'Ashton Craig',pos:"OL"},
  {num:"71",name:'Styles Prescod',pos:"OL"},
  {num:"74",name:'Will Black',pos:"OL"},
  {num:"75",name:'Sullivan Absher',pos:"OL"},
  {num:"76",name:'Guerby Lambert',pos:"OL"},
  {num:"77",name:'Peter Jones',pos:"OL"},
  {num:"78",name:'Owen Strebig',pos:"OL"},
  {num:"84",name:'Preston Fryzel',pos:"TE"},
  {num:"85",name:'Jack Larsen',pos:"TE"},
  {num:"86",name:'Kaleb Johnson',pos:"TE"},
  {num:"87",name:'Cooper Flanagan',pos:"TE"},
  {num:"88",name:'James Flanigan',pos:"TE"},
  {num:"88",name:'Armel Mukam',pos:"DL"},
  {num:"89",name:'Austin Ratigan',pos:"TE"},
  {num:"90",name:'Elijah Golden',pos:"DL"},
  {num:"91",name:'Gordy Sulfsted',pos:"DL"},
  {num:"94",name:'Joe Reiff',pos:"DL"},
  {num:"95",name:'Bryce Young',pos:"DL"},
  {num:"96",name:'Joseph Vinci',pos:"LS"}
];

const STORAGE_KEY = "irish_player_iq_final_v1";
const state = Object.assign({score:0, streak:0, best:0, seen:0}, (()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{}}catch(e){return {}}})());
let current = null;
let mode = "number";
let locked = false;

const $ = (s) => document.querySelector(s);
const esc = (v) => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle = (a) => {
  const x=[...a];
  for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}
  return x;
};
const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {} };
const unique = (field) => [...new Set(ROSTER.map(p=>p[field]))];

function statsHTML(){
  return `<div class="stats">
    <div class="stat"><strong>${state.score}</strong><span>SCORE</span></div>
    <div class="stat"><strong>${state.streak}</strong><span>STREAK</span></div>
    <div class="stat"><strong>${state.best}</strong><span>BEST</span></div>
  </div>`;
}

function shell(title, back=true){
  return `<div class="goldline"></div>
    <header class="bar">
      <div class="brand">IRISH <b>PLAYER IQ</b></div>
      ${back?'<button class="small-btn" onclick="window.IPIQ.home()">MENU</button>':''}
    </header>
    <div class="eyebrow left">NOTRE DAME FOOTBALL • 2026–27</div>
    <div class="page-title">${title}</div>`;
}

function home(){
  document.body.className="";
  document.body.innerHTML=`<div class="screen">
    <div class="goldline"></div>
    <div class="hero">
      <div class="eyebrow">NOTRE DAME FOOTBALL • 2026–27</div>
      <h1>IRISH<br><span>PLAYER IQ</span></h1>
      <p class="hero-sub">Master the names, numbers, positions and faces of the Fighting Irish roster.</p>
    </div>
    ${statsHTML()}
    <section class="menu-grid">
      <button class="menu-card featured" onclick="window.IPIQ.quiz('number')">
        <div class="tag">01 • QUICK PLAY</div><h2>NUMBER + POSITION → PLAYER</h2>
        <p>See a jersey number and position. Identify the Irish player.</p>
      </button>
      <button class="menu-card" onclick="window.IPIQ.quiz('player')">
        <div class="tag">02 • ROSTER CHALLENGE</div><h2>PLAYER → NUMBER</h2>
        <p>See the player name and recall the jersey number.</p>
      </button>
      <button class="menu-card" onclick="window.IPIQ.quiz('position')">
        <div class="tag">03 • POSITION MODE</div><h2>PLAYER → POSITION</h2>
        <p>Practice the player's position along with his name.</p>
      </button>
      <button class="menu-card" onclick="window.IPIQ.study()">
        <div class="tag">04 • STUDY / PHOTO LAB</div><h2>STUDY THE ROSTER</h2>
        <p>Review players now. Official uniform photos can be added here next.</p>
      </button>
    </section>
    <p class="note">Duplicate jersey numbers are intentional. A number by itself is never treated as a unique player.</p>
  </div>`;
}

function nameChoices(){
  const samePos = ROSTER.filter(p=>p.name!==current.name && p.pos===current.pos).map(p=>p.name);
  const other = ROSTER.filter(p=>p.name!==current.name && p.pos!==current.pos).map(p=>p.name);
  return shuffle([current.name,...shuffle([...new Set(samePos)]).slice(0,2),...shuffle([...new Set(other)]).slice(0,1)]);
}

function choices(field, correct){
  return shuffle([correct,...shuffle(unique(field).filter(v=>v!==correct)).slice(0,3)]);
}

function quiz(which){
  mode=which; locked=false;
  current=ROSTER[Math.floor(Math.random()*ROSTER.length)];

  let prompt, visual, answer, options;
  if(which==="number"){
    prompt="NUMBER + POSITION → NAME";
    visual=`<div class="big-number">#${current.num}</div><div class="position-chip">${current.pos}</div>`;
    answer=current.name; options=nameChoices();
  } else if(which==="player"){
    prompt="NAME → NUMBER";
    visual=`<div class="player-name">${esc(current.name)}</div><div class="position-chip">#${current.num} • ${current.pos}</div>`;
    answer=current.num; options=choices("num",current.num);
  } else {
    prompt="NAME → POSITION";
    visual=`<div class="player-name">${esc(current.name)}</div><div class="position-chip">#${current.num}</div>`;
    answer=current.pos; options=choices("pos",current.pos);
  }

  document.body.className="game";
  document.body.innerHTML=`<div class="screen">
    ${shell(which==="number"?"QUICK PLAY":which==="player"?"ROSTER CHALLENGE":"POSITION MODE")}
    ${statsHTML()}
    <section class="quiz-card">
      <div class="prompt">${prompt}</div>
      ${visual}
      <div class="answers">
        ${options.map((o,i)=>`<button class="answer" data-i="${i}" onclick="window.IPIQ.answer(${i},${JSON.stringify(answer)})">${esc(o)}</button>`).join("")}
      </div>
      <div id="result"></div>
      <button id="next" class="next" onclick="window.IPIQ.quiz('${which}')">NEXT QUESTION</button>
    </section>
    <div class="utility"><button onclick="window.IPIQ.home()">MENU</button><button onclick="window.IPIQ.reset()">RESET SCORE</button></div>
    <p class="note">Roster source: Notre Dame Fighting Irish 2026–27 football roster. Duplicate numbers are handled by including position.</p>
  </div>`;
}

function answer(index, correct){
  if(locked)return;
  locked=true;
  const buttons=[...document.querySelectorAll(".answer")];
  const selected=buttons[index].textContent.trim();
  buttons.forEach(b=>{b.disabled=true;if(b.textContent.trim()===correct)b.classList.add("correct")});
  const result=$("#result");
  state.seen++;
  if(selected===correct){
    state.score++; state.streak++; state.best=Math.max(state.best,state.streak);
    buttons[index].classList.add("correct");
    result.innerHTML=`<div class="message good"><b>✓ CORRECT!</b><span>${esc(current.name)} • #${current.num} • ${current.pos}</span></div>`;
  } else {
    state.streak=0; buttons[index].classList.add("wrong");
    result.innerHTML=`<div class="message bad"><b>✕ NOT QUITE</b><span>${esc(current.name)} wears #${current.num} • ${current.pos}</span></div>`;
  }
  save();
  $(".next").style.display="block";
  document.querySelector(".stats").outerHTML=statsHTML();
}

function reset(){
  if(!confirm("Reset your Irish Player IQ score, streak and best score?"))return;
  state.score=0;state.streak=0;state.best=0;state.seen=0;save();home();
}

function study(){
  const list=shuffle(ROSTER);
  document.body.className="";
  document.body.innerHTML=`<div class="screen">
    ${shell("STUDY / PHOTO LAB")}
    <section class="photo-card">
      <div class="prompt">PHOTO LAB</div>
      <div class="photo-placeholder"><b>PLAYER PHOTOS NEXT</b><span>Official Notre Dame uniform photos with the number visible will be added here.</span></div>
      <p>We can use the photos to create face + number questions after the clean app is confirmed working.</p>
    </section>
    <div class="section-label">ROSTER REVIEW</div>
    <div class="study-grid">${list.slice(0,30).map(p=>`<div class="study"><b>#${p.num}</b><strong>${esc(p.name)}</strong><small>${p.pos}</small></div>`).join("")}</div>
    <div class="utility"><button onclick="window.IPIQ.home()">MENU</button><button onclick="window.IPIQ.study()">SHUFFLE</button></div>
  </div>`;
}

window.IPIQ={home,quiz,answer,reset,study};
home();
})();
