/* Irish Player IQ — full game rebuild */
(() => {
"use strict";

const ROSTER = `0|Tionne Gray|DL
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
96|Joseph Vinci|LS`.trim().split("\n").map(x=>{const [num,name,pos]=x.split("|");return {num,name,pos}});
const SCHEDULE = [["Sep 6", "Wisconsin", "Lambeau Field", "7:30 PM", "NEUTRAL"], ["Sep 12", "Rice", "Notre Dame Stadium", "3:30 PM", "HOME"], ["Sep 19", "Michigan State", "Notre Dame Stadium", "7:30 PM", "HOME"], ["Sep 26", "Purdue", "Ross-Ade Stadium", "TBA", "AWAY"], ["Oct 3", "North Carolina", "Kenan Memorial Stadium", "TBA", "AWAY"], ["Oct 10", "Stanford", "Notre Dame Stadium", "3:30 PM", "HOME"], ["Oct 17", "BYU", "LaVell Edwards Stadium", "TBA", "AWAY"], ["Oct 31", "Navy", "Gillette Stadium", "12:00 PM", "AWAY"], ["Nov 7", "Miami", "Notre Dame Stadium", "7:30 PM", "HOME"], ["Nov 14", "Boston College", "Notre Dame Stadium", "3:30 PM", "HOME"], ["Nov 21", "SMU", "Notre Dame Stadium", "7:30 PM", "HOME"], ["Nov 28", "Syracuse", "JMA Wireless Dome", "TBA", "AWAY"]];
const STORAGE="irish-player-iq-ultimate-v1";
const MODES={
 mix:{title:"MIX-UP",sub:"All question types mixed",icon:"✦"},
 number:{title:"NUMBER → PLAYER",sub:"See a number and name the player",icon:"ϟ"},
 playerNumber:{title:"PLAYER → NUMBER",sub:"See a player and recall the jersey number",icon:"#"},
 playerPosition:{title:"PLAYER → POSITION",sub:"See a player and name the position",icon:"♟"},
 photoPlayer:{title:"PHOTO → PLAYER",sub:"See a photo and name the player",icon:"▣"},
 photoNumber:{title:"PHOTO → NUMBER",sub:"See a photo and name the number",icon:"▣"},
 photoPosition:{title:"PHOTO → POSITION",sub:"See a photo and name the position",icon:"▣"},
 hidden:{title:"HIDDEN NUMBER",sub:"Name the player and number",icon:"◉"}
};
let data={score:0,streak:0,best:0,xp:0,roundCorrect:0,roundTotal:0,mode:"mix",mastery:{}};
try{data={...data,...JSON.parse(localStorage.getItem(STORAGE)||"{}")}}catch(e){}
let screen="home", round=0, current=null, locked=false, answers=[], history=[];

const app=document.getElementById("app");
const save=()=>localStorage.setItem(STORAGE,JSON.stringify(data));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const uniq=k=>[...new Set(ROSTER.map(p=>p[k]))];
const id=p=>p.num+"_"+p.name.toLowerCase().replace(/[^a-z0-9]+/g,"-");
const mastered=()=>Object.values(data.mastery).filter(x=>x>=5).length;
const pct=()=>Math.round(mastered()/ROSTER.length*100);
const xpLevel=()=>Math.max(1,Math.floor(data.xp/500)+1);
function markMastery(p,ok){const k=id(p);data.mastery[k]=Math.max(0,(data.mastery[k]||0)+(ok?1:-0.35));data.xp+=ok?25:0;save()}

function layout(content,active="home") {
 app.innerHTML=`<div class="app"><div class="topline"></div><div class="shell">
 <div class="topbar"><button class="iconbtn" data-action="home">☘</button><div class="top-title">IRISH PLAYER IQ • 2026–27</div><button class="iconbtn" data-action="more">•••</button></div>
 <div id="content">${content}</div></div>
 <nav class="bottomnav">
  <button class="navbtn ${active==="home"?"active":""}" data-nav="home"><span class="ico">⌂</span>HOME</button>
  <button class="navbtn ${active==="progress"?"active":""}" data-nav="progress"><span class="ico">▥</span>MY PROGRESS</button>
  <button class="navbtn ${active==="games"?"active":""}" data-nav="games"><span class="ico">◉</span>GAMES</button>
  <button class="navbtn ${active==="season"?"active":""}" data-nav="season"><span class="ico">▦</span>SEASON</button>
  <button class="navbtn ${active==="more"?"active":""}" data-nav="more"><span class="ico">•••</span>MORE</button>
 </nav></div>`;
 document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>go(b.dataset.nav));
 document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>go(b.dataset.action));
}

function home(){
 layout(`<section class="hero"><div class="eyebrow">NOTRE DAME FOOTBALL • 2026–27</div><h1>IRISH<br>PLAYER IQ</h1><p>Master the names, numbers, positions and faces of the Fighting Irish roster.</p></section>
 <div class="stats"><div class="stat"><div class="n">${data.score}</div><div class="l">SCORE</div></div><div class="stat"><div class="n">${data.streak}</div><div class="l">STREAK</div></div><div class="stat"><div class="n">${data.best}</div><div class="l">BEST</div></div></div>
 <div class="home-grid">
  <button class="menu-card featured big" data-mode="mix"><div class="tag">01 • QUICK PLAY</div><h3>MIX-UP</h3><p>All question types mixed. Build real roster recall.</p></button>
  <button class="menu-card" data-mode="number"><div class="tag">02 • ROSTER CHALLENGE</div><h3>NUMBER → PLAYER</h3><p>See a jersey number and identify the Irish player.</p></button>
  <button class="menu-card" data-mode="playerNumber"><div class="tag">03 • MEMORY</div><h3>PLAYER → NUMBER</h3><p>See the name and recall the jersey number.</p></button>
  <button class="menu-card" data-mode="playerPosition"><div class="tag">04 • POSITION MODE</div><h3>PLAYER → POSITION</h3><p>Practice the player's position along with his name.</p></button>
  <button class="menu-card" data-mode="photoPlayer"><div class="tag">05 • VISUAL IQ</div><h3>PHOTO → PLAYER</h3><p>Learn to recognize the player from his uniform photo.</p></button>
  <button class="menu-card" data-action="progress"><div class="tag">06 • YOUR IRISH IQ</div><h3>${pct()}% LEARNED</h3><p>${mastered()} of ${ROSTER.length} players at mastery level.</p></button>
 </div>
 <div class="section-title">NEXT GAME</div>
 <div class="menu-card" data-action="season"><div class="tag">SUN • SEP 6 • 7:30 PM ET</div><h3>WISCONSIN • LAMBEAU FIELD</h3><p>2026 Shamrock Series • NBC & Peacock</p></div>`);
 document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>startRound(b.dataset.mode));
 document.querySelectorAll('[data-action="progress"],[data-action="season"]').forEach(b=>b.onclick=()=>go(b.dataset.action));
}

function games(){
 layout(`<div class="screen"><div class="screen-head"><h2>QUICK PLAY</h2><div class="sub">CHOOSE A MODE</div></div><div class="mode-list">
 ${Object.entries(MODES).map(([k,m])=>`<button class="mode-row ${data.mode===k?"active":""}" data-mode="${k}"><div class="mode-icon">${m.icon}</div><div><strong>${m.title}</strong><span>${m.sub}</span></div></button>`).join("")}
 </div></div>`,"games");
 document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>startRound(b.dataset.mode));
}

function makeQuestion(){
 current=ROSTER[Math.floor(Math.random()*ROSTER.length)];
 let m=data.mode;
 if(m==="mix") m=shuffle(["number","playerNumber","playerPosition","photoPlayer","photoNumber","photoPosition","hidden"])[0];
 if(m==="number") return {kind:m,label:"WHO IS THIS PLAYER?",question:`#${current.num}`,answer:current.name,choices:nameChoices()};
 if(m==="playerNumber") return {kind:m,label:"WHAT IS HIS JERSEY NUMBER?",question:current.name,answer:current.num,choices:choices(current.num,"num")};
 if(m==="playerPosition") return {kind:m,label:"WHAT POSITION DOES HE PLAY?",question:current.name,answer:current.pos,choices:choices(current.pos,"pos")};
 if(m.startsWith("photo")) return {kind:m,label:m==="photoPlayer"?"WHO IS THIS PLAYER?":m==="photoNumber"?"WHAT IS HIS JERSEY NUMBER?":"WHAT POSITION DOES HE PLAY?",question:"PHOTO",answer:m==="photoPlayer"?current.name:m==="photoNumber"?current.num:current.pos,choices:m==="photoPlayer"?nameChoices():m==="photoNumber"?choices(current.num,"num"):choices(current.pos,"pos"),photo:true};
 return {kind:"hidden",label:"HIDDEN NUMBER • NAME THE PLAYER + NUMBER",question:current.name,answer:current.name,choices:nameChoices()};
}
function choices(correct,field){return shuffle([correct,...shuffle(uniq(field).filter(x=>x!==correct)).slice(0,3)])}
function nameChoices(){return shuffle([current.name,...shuffle(ROSTER.filter(p=>p.name!==current.name && !(p.num===current.num&&p.pos===current.pos)).map(p=>p.name)).slice(0,3)])}

function photoBlock(p) {
 const slug=p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
 return `<div class="photo"><img src="./photos/${slug}.jpg" alt="" onerror="this.remove();this.parentElement.innerHTML='<div class="photo-fallback"><div class="jersey">#${esc(p.num)}</div><small>OFFICIAL UNIFORM PHOTO<br>ADD PHOTO TO /photos</small></div>'"></div>`;
}

function quiz(){
 if(!current) current=ROSTER[Math.floor(Math.random()*ROSTER.length)];
 const q=makeQuestion(); current=q.__player||current; locked=false; answers=q.choices;
 layout(`<div class="quiz"><div class="quiz-meta"><span>${data.mode==="mix"?"MIX-UP":MODES[data.mode]?.title||"QUIZ"}</span><span>QUESTION <b>${round+1}</b> OF 10</span></div><div class="progressbar"><i style="width:${(round/10)*100}%"></i></div>
 <div class="question-card"><div class="q-label">${q.label}</div>${q.photo?photoBlock(current):""}<h2>${esc(q.question)}</h2><div class="choices">${q.choices.map((c,i)=>`<button class="choice" data-i="${i}">${esc(c)}</button>`).join("")}</div><div id="answer-note"></div><div class="quiz-actions"><button class="smallbtn" id="fifty">50/50</button><button class="smallbtn goldbtn" id="boost">3 ⚡ BOOST</button><button class="smallbtn" id="skip">SKIP</button></div></div></div>`,"games");
 document.querySelectorAll(".choice").forEach(b=>b.onclick=()=>answer(+b.dataset.i,q));
 document.getElementById("skip").onclick=()=>nextQuestion(true);
 document.getElementById("fifty").onclick=()=>fifty(q);
 document.getElementById("boost").onclick=()=>document.getElementById("boost").textContent="⚡ USED";
}

function fifty(q){
 const bs=[...document.querySelectorAll(".choice")]; const wrong=bs.filter((b,i)=>q.choices[i]!==q.answer); shuffle(wrong).slice(0,2).forEach(b=>b.disabled=true);
}
function answer(i,q){
 if(locked)return; locked=true;
 const ok=q.choices[i]===q.answer;
 const bs=[...document.querySelectorAll(".choice")]; bs[i].classList.add(ok?"correct":"wrong");
 bs.forEach((b,idx)=>{if(q.choices[idx]===q.answer)b.classList.add("correct")});
 if(ok){data.score++;data.streak++;data.best=Math.max(data.best,data.streak);data.roundCorrect++;markMastery(current,true)}
 else data.streak=0;
 data.roundTotal++; save();
 document.getElementById("answer-note").className="answer-note "+(ok?"good":"bad");
 document.getElementById("answer-note").innerHTML=ok?`✓ CORRECT — ${esc(current.name)} • #${esc(current.num)} • ${esc(current.pos)}`:`✕ NOT QUITE — ${esc(current.name)} is #${esc(current.num)} (${esc(current.pos)})`;
 const actions=document.querySelector(".quiz-actions"); actions.innerHTML=`<button class="smallbtn" id="next">NEXT</button>`;
 document.getElementById("next").onclick=()=>nextQuestion(false);
}
function nextQuestion(skip){round++;if(round>=10)roundScreen();else quiz()}

function roundScreen(){
 const correct=data.roundCorrect, total=data.roundTotal, score=data.score;
 layout(`<div class="round-card"><div class="check">✓</div><div class="q-label">ROUND COMPLETE</div><h2>NICE WORK!</h2><p>You answered ${correct} of 10 correctly.</p><div class="round-score"><div><b>${data.best}</b><span>LONGEST STREAK</span></div><div><b>${score}</b><span>SCORE</span></div><div><b>${xpLevel()}</b><span>IQ LEVEL</span></div></div><button class="smallbtn goldbtn" id="continue">CONTINUE</button></div>`,"games");
 document.getElementById("continue").onclick=()=>{round=0;data.roundCorrect=0;data.roundTotal=0;startRound(data.mode)};
}

function progress(){
 const list=ROSTER.map(p=>{const m=data.mastery[id(p)]||0;return {p,m}}).sort((a,b)=>b.m-a.m);
 layout(`<div class="screen"><div class="screen-head"><h2>MY PROGRESS</h2><div class="sub">LEVEL ${xpLevel()} • ${data.xp} XP</div></div><div class="tabs"><button class="tab active">PLAYERS</button><button class="tab">NUMBERS</button><button class="tab">POSITIONS</button><button class="tab">VISUAL</button></div><input class="search" id="search" placeholder="Search players..."><div id="plist">${list.slice(0,40).map(x=>progressRow(x)).join("")}</div></div>`,"progress");
 document.getElementById("search").oninput=e=>{const q=e.target.value.toLowerCase();document.getElementById("plist").innerHTML=list.filter(x=>x.p.name.toLowerCase().includes(q)||x.p.num===q||x.p.pos.toLowerCase()===q).slice(0,60).map(progressRow).join("")||'<div class="empty">No players found.</div>'};
}
function progressRow(x){const v=Math.min(100,Math.round(x.m/5*100));return `<div class="progress-card"><div class="progress-top"><div class="avatar">#${esc(x.p.num)}</div><div><strong>${esc(x.p.name)}</strong><small>${esc(x.p.pos)} • ${x.m>=5?"MASTERED":x.m>0?"IN PROGRESS":"NOT STARTED"}</small></div><div class="pct">${v}%</div></div><div class="meter"><i style="width:${v}%"></i></div></div>`}

function season(){
 layout(`<div class="screen"><div class="screen-head"><h2>2026 SEASON</h2><div class="sub">12 REGULAR-SEASON GAMES</div></div><div class="menu-card featured" style="margin-bottom:12px"><div class="tag">NEXT GAME</div><h3>WISCONSIN • SEP 6 • 7:30 PM ET</h3><p>Lambeau Field • Green Bay, WI • Shamrock Series</p></div><div>${SCHEDULE.map(g=>`<div class="game-row"><div class="date">${g[0]}</div><div><div class="opp">${g[1]}</div><div class="venue">${g[2]} • ${g[3]}</div></div><div class="sidepill">${g[4]}</div></div>`).join("")}</div></div>`,"season");
}

function more(){
 layout(`<div class="screen"><div class="screen-head"><h2>MORE</h2></div><div class="mode-list">
 <button class="mode-row" id="reset"><div class="mode-icon">↺</div><div><strong>RESET PROGRESS</strong><span>Clear score, streak, XP and mastery.</span></div></button>
 <button class="mode-row" id="official"><div class="mode-icon">↗</div><div><strong>OFFICIAL NOTRE DAME ROSTER</strong><span>Open the verified roster source.</span></div></button>
 <button class="mode-row"><div class="mode-icon">☘</div><div><strong>IRISH PLAYER IQ</strong><span>2026–27 roster memory game • 114 players.</span></div></button>
 </div></div>`,"more");
 document.getElementById("reset").onclick=()=>{if(confirm("Reset all Irish Player IQ progress?")){localStorage.removeItem(STORAGE);location.reload()}};
 document.getElementById("official").onclick=()=>window.open("https://fightingirish.com/sports/football/roster/season/2026-27/","_blank");
}

function go(s){screen=s;if(s==="home")home();if(s==="games")games();if(s==="progress")progress();if(s==="season")season();if(s==="more")more()}

function startRound(mode){data.mode=mode;data.roundCorrect=0;data.roundTotal=0;round=0;save();quiz()}

document.addEventListener("click",e=>{const m=e.target.closest("[data-mode]");if(m&&m.closest(".home-grid"))startRound(m.dataset.mode)});
home();
})();
