(()=>{'use strict';
const KEY='irish-player-iq-final-v10';
const DEFAULT_ROSTER=`0|Tionne Gray|DL
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
96|Joseph Vinci|LS`.split('\n').map(x=>{const [num,name,pos]=x.split('|');return{num,name,pos}});
let ROSTER=[...DEFAULT_ROSTER];
let SCHEDULE=[];
async function hydrateData(){try{const r=await fetch('roster.json?'+Date.now(),{cache:'no-store'});if(r.ok){const d=await r.json();if(Array.isArray(d.players)&&d.players.length>=100)ROSTER=d.players.map(p=>({num:String(p.num),name:p.name,pos:p.pos}));}}catch(e){} try{const r=await fetch('schedule.json?'+Date.now(),{cache:'no-store'});if(r.ok){const d=await r.json();SCHEDULE=Array.isArray(d)?d:(d.games||[]);}}catch(e){} render();}

const MODE_TYPES=['numberPlayer','playerNumber','playerPosition','photoPlayer','photoNumber','photoPosition','hidden'];
let state=(()=>{try{return Object.assign({view:'home',mode:'mix',score:0,streak:0,best:0,round:1,roundCorrect:0,roundScore:0,progress:{},numProgress:{},posProgress:{},visualProgress:{},history:[],boosts:3,fifty:false,activeQuestion:null,current:null,progressTab:'players'},JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{return {view:'home',mode:'mix',score:0,streak:0,best:0,round:1,roundCorrect:0,roundScore:0,progress:{},numProgress:{},posProgress:{},visualProgress:{},history:[],boosts:3,fifty:false}}})();
const app=document.getElementById('app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sh=a=>{a=[...a];for(let i=a.length-1;i;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const slug=s=>s.normalize('NFKD').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function photo(p,cls=''){const s=slug(p.name);const c=[`photos/${s}.jpg`,`photos/${s}.jpeg`,`photos/${s}.png`,`photos/${s}.webp`,`photos/${p.num}-${s}.jpg`,`photos/${s}-${p.num}.jpg`];return `<img class="${cls}" src="${c[0]}" data-candidates='${esc(JSON.stringify(c))}' data-i="0" alt="${esc(p.name)}" onerror="nextPhoto(this)">`}
window.nextPhoto=el=>{let c;try{c=JSON.parse(el.dataset.candidates)}catch{return}let i=+el.dataset.i+1;if(i<c.length){el.dataset.i=i;el.src=c[i]}else{el.outerHTML='<div class="photo-fallback"><span>ND</span><small>PHOTO</small></div>'}};
function unique(field){return [...new Set(ROSTER.map(p=>p[field]))]}
function choices(correct,vals){return sh([correct,...sh([...new Set(vals.filter(x=>x!==correct))]).slice(0,3)])}
function mastered(obj){return Object.values(obj).filter(v=>v>=3).length}
function pct(obj,total){return Math.min(100,Math.round(mastered(obj)/total*100))}
function top(){return `<div class="goldbar"></div><header class="topbar"><button class="top-icon" data-nav="home">ND</button><div class="brand"><b>IRISH PLAYER IQ</b><small>NOTRE DAME FOOTBALL • 2026–27</small></div><button class="top-icon dots" data-nav="more">•••</button></header>`}
function nav(){return `<nav class="bottomnav">${[['home','⌂','HOME'],['progress','◔','MY IQ'],['games','⚡','GAMES'],['season','▦','SEASON'],['more','•••','MORE']].map(([v,i,t])=>`<button class="navbtn ${state.view===v?'active':''}" data-nav="${v}"><span>${i}</span><em>${t}</em></button>`).join('')}</nav>`}
function shell(body,cls='screen'){return `<div class="app">${top()}<main class="${cls}">${body}</main>${nav()}</div>`}
function home(){const m=pct(state.progress,114);const featured=sh(ROSTER).slice(0,6);return shell(`<section class="home-hero"><div class="crest"><b>ND</b><span>FIGHTING IRISH</span></div><div class="kicker">KNOW THE IRISH. LIVE THE GAME.</div><h1>PLAYER <strong>IQ</strong></h1><p>Learn every name, number, position and face on the 2026–27 roster.</p></section><section class="iq-panel"><div class="ring" style="--deg:${m*3.6}deg"><div><b>${m}%</b><small>MASTERED</small></div></div><div class="iq-copy"><div class="eyebrow">YOUR IRISH IQ</div><div class="iq-stats"><span><b>${mastered(state.progress)}</b> PLAYERS</span><span><b>${mastered(state.numProgress)}</b> NUMBERS</span><span><b>${mastered(state.posProgress)}</b> POSITIONS</span><span><b>${mastered(state.visualProgress)}</b> VISUAL</span></div></div></section><section class="next-card"><div><div class="eyebrow">NEXT GAME</div><h2>VS RICE</h2><p>September 13 • 3:30 PM ET<br>Notre Dame Stadium</p></div><button class="gold-button" data-action="gameprep">GAME PREP <span>→</span></button></section><section class="face-strip"><div class="section-head"><span>MEET THE IRISH</span><small>VISUAL RECOGNITION</small></div><div class="faces">${featured.map(p=>`<button class="face" data-player="${esc(p.name)}">${photo(p)}<span>#${esc(p.num)}</span></button>`).join('')}</div></section><section class="section-head choose"><span>CHOOSE YOUR TRAINING</span><small>BUILD COMPLETE RECALL</small></section><div class="home-modes">${homeMode('⚡','QUICK PLAY','Mix every question type.','mix')}${homeMode('#','ROSTER CHALLENGE','See the player + position. Recall the number.','playerNumber')}${homeMode('♟','POSITION MODE','See the player + number. Recall the position.','playerPosition')}${homeMode('▣','VISUAL IQ','Use uniform photos to learn faces.','photoPlayer')}${homeMode('◉','ELITE MODE','Hide the number. Trust your memory.','hidden')}</div>`, 'screen home-screen')}
function homeMode(icon,title,sub,mode){return `<button class="home-mode" data-mode="${mode}"><div class="mode-icon">${icon}</div><div><b>${title}</b><span>${sub}</span></div><i>›</i></button>`}
function chooseModes(){return shell(`<section class="page-head"><button data-nav="home">‹</button><div><h1>QUICK PLAY</h1><p>CHOOSE YOUR TRAINING MODE</p></div></section><div class="mode-list">${listMode('mix','⚡','MIX-UP','All question types mixed.')}${listMode('numberPlayer','#','NUMBER → PLAYER','See the jersey number, name the player.')}${listMode('playerNumber','01','PLAYER → NUMBER','See name + position, recall the number.')}${listMode('playerPosition','♟','PLAYER → POSITION','See name + number, recall the position.')}${listMode('photoPlayer','▣','PHOTO → PLAYER','See the uniform, name the player.')}${listMode('photoNumber','▣','PHOTO → NUMBER','See the uniform + identity, recall the number.')}${listMode('photoPosition','▣','PHOTO → POSITION','See the uniform + identity, recall the position.')}${listMode('hidden','◉','HIDDEN NUMBER','See the player, recall what the jersey hides.')} </div>`, 'screen')}
function listMode(m,ico,t,d){return `<button class="listmode" data-mode="${m}"><span class="li-icon">${ico}</span><span><b>${t}</b><small>${d}</small></span><i>›</i></button>`}
function newQuestion(){let p=ROSTER[Math.floor(Math.random()*ROSTER.length)];let mode=state.mode==='mix'?MODE_TYPES[Math.floor(Math.random()*modes.length)]:state.mode;state.current=p;state.activeQuestion=mode;state.locked=false;state.fifty=false;save();render()}
function promptData(){const p=state.current,m=state.activeQuestion||state.mode;let q={title:'',label:'',answer:'',choices:[],support:''};if(m==='numberPlayer'){q.title='WHO IS THIS PLAYER?';q.label='NUMBER → PLAYER';q.answer=p.name;q.choices=choices(p.name,ROSTER.map(x=>x.name));q.support=`#${p.num}`;}else if(m==='playerNumber'){q.title='WHAT IS HIS JERSEY NUMBER?';q.label='PLAYER → NUMBER';q.answer=p.num;q.choices=choices(p.num,ROSTER.map(x=>x.num));q.support=`${p.name} • ${p.pos}`;}else if(m==='playerPosition'){q.title='WHAT POSITION DOES HE PLAY?';q.label='PLAYER → POSITION';q.answer=p.pos;q.choices=choices(p.pos,ROSTER.map(x=>x.pos));q.support=`${p.name} • #${p.num}`;}else if(m==='photoPlayer'){q.title='WHO IS THIS PLAYER?';q.label='PHOTO → PLAYER';q.answer=p.name;q.choices=choices(p.name,ROSTER.map(x=>x.name));q.support='Uniform recognition';}else if(m==='photoNumber'){q.title='WHAT IS HIS JERSEY NUMBER?';q.label='PHOTO → NUMBER';q.answer=p.num;q.choices=choices(p.num,ROSTER.map(x=>x.num));q.support=`${p.name} • ${p.pos}`;}else if(m==='photoPosition'){q.title='WHAT POSITION DOES HE PLAY?';q.label='PHOTO → POSITION';q.answer=p.pos;q.choices=choices(p.pos,ROSTER.map(x=>x.pos));q.support=`${p.name} • #${p.num}`;}else{q.title='WHO IS THIS PLAYER?';q.label='ELITE • HIDDEN NUMBER';q.answer=p.name;q.choices=choices(p.name,ROSTER.map(x=>x.name));q.support='Number hidden';}return q}
function quiz(){if(!state.current)newQuestion();const p=state.current,m=state.activeQuestion||state.mode,q=promptData();let visual='';if(m==='numberPlayer')visual=`<div class="number-hero">#${esc(p.num)}</div>`;if(m==='playerNumber')visual=`<div class="identity-card"><div class="identity-photo">${photo(p)}</div><div><h2>${esc(p.name)}</h2><b>${esc(p.pos)}</b></div></div>`;if(m==='playerPosition')visual=`<div class="identity-card"><div class="identity-photo">${photo(p)}</div><div><h2>${esc(p.name)}</h2><b>#${esc(p.num)}</b></div></div>`;if(m==='photoPlayer')visual=`<div class="quiz-photo">${photo(p)}</div>`;if(m==='photoNumber')visual=`<div class="identity-card"><div class="identity-photo large">${photo(p)}</div><div><h2>${esc(p.name)}</h2><b>${esc(p.pos)}</b></div></div>`;if(m==='photoPosition')visual=`<div class="identity-card"><div class="identity-photo large">${photo(p)}</div><div><h2>${esc(p.name)}</h2><b>#${esc(p.num)}</b></div></div>`;if(m==='hidden')visual=`<div class="hidden-card"><div class="identity-photo">${photo(p)}</div><div><h2>${esc(p.name)}</h2><b>JERSEY NUMBER HIDDEN</b></div><div class="masked"># • •</div></div>`;return shell(`<div class="quiz-head"><div><span>ROUND ${state.round} / 10</span><b>${q.label}</b></div><div class="score-mini">${state.score}<small>IQ</small></div></div><section class="quiz-card"><div class="eyebrow">${q.label}</div><h1>${q.title}</h1>${visual}<div class="answer-label">CHOOSE YOUR ANSWER</div><div class="answers">${q.choices.map((c,i)=>`<button class="answer" data-index="${i}" data-answer="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="quiz-tools"><button class="tool" data-action="fifty">50/50</button><div class="boost"><b>${state.boosts}</b> BOOSTS</div><button class="tool" data-action="skip">SKIP</button></div><div id="result"></div></section>`, 'screen quiz-screen')}
function answer(btn){if(state.locked)return;state.locked=true;const q=promptData();const selected=btn.dataset.answer;const correct=selected===q.answer;document.querySelectorAll('.answer').forEach(b=>b.disabled=true);if(correct){btn.classList.add('correct');state.score+=350;state.streak++;state.best=Math.max(state.best,state.streak);state.roundCorrect++;bump(state.current,state.activeQuestion)}else{btn.classList.add('wrong');state.streak=0;document.querySelectorAll('.answer').forEach(b=>{if(b.dataset.answer===q.answer)b.classList.add('correct')})}save();const reveal=correct?`<div class="learn-result good"><b>✓ CORRECT</b><span>Keep building that recall.</span></div>`:`<div class="learn-result"><b>LEARN IT: ${esc(q.answer)}</b><span>${esc(q.label==='PLAYER → NUMBER'||q.label==='PHOTO → NUMBER'?`The correct jersey number is #${q.answer}.`:q.label==='PLAYER → POSITION'||q.label==='PHOTO → POSITION'?`The correct position is ${q.answer}.`:`The correct player is ${q.answer}.`)}</span></div>`;document.getElementById('result').innerHTML=reveal+`<button class="continue" data-action="next">${state.round>=10?'FINISH ROUND':'NEXT QUESTION'} →</button>`;bind()}
function bump(p,mode){let obj=state.progress;if(mode==='playerNumber'||mode==='photoNumber')obj=state.numProgress;else if(mode==='playerPosition'||mode==='photoPosition')obj=state.posProgress;else if(mode==='photoPlayer')obj=state.visualProgress;obj[p.name]=(obj[p.name]||0)+1;state.progress[p.name]=(state.progress[p.name]||0)+1}
function progress(){const tabs=[['players','PLAYERS'],['numbers','NUMBERS'],['positions','POSITIONS'],['visual','VISUAL']];let obj=state.progress,items=ROSTER;if(state.progressTab==='numbers'){obj=state.numProgress;items=ROSTER.filter((p,i,a)=>a.findIndex(x=>x.num===p.num)===i)}if(state.progressTab==='positions'){obj=state.posProgress;items=[...new Set(ROSTER.map(x=>x.pos))].map(pos=>({name:pos,num:'',pos}))}if(state.progressTab==='visual')obj=state.visualProgress;items=items.sort((a,b)=>(obj[b.name]||0)-(obj[a.name]||0)).slice(0,40);return shell(`<section class="page-head"><div><h1>MY IRISH IQ</h1><p>MASTER THE ROSTER</p></div></section><div class="big-progress"><div class="big-pct">${pct(state.progress,114)}%</div><div><b>OVERALL MASTERY</b><span>${mastered(state.progress)} of 114 players mastered</span></div></div><div class="tabs">${tabs.map(([v,t])=>`<button class="tab ${state.progressTab===v?'active':''}" data-ptab="${v}">${t}</button>`).join('')}</div><div class="progress-list">${items.map(p=>`<div class="p-row"><div class="p-photo">${photo(p)}</div><div><b>${esc(p.num?`#${p.num}  ${p.name}`:p.name)}</b><small>${esc(p.pos)}</small></div><strong>${Math.min(100,(obj[p.name]||0)*20)}%</strong></div>`).join('')}</div>`,'screen')}
function games(){return shell(`<section class="page-head"><div><h1>GAMES</h1><p>PLAY • PRACTICE • MASTER</p></div></section><div class="feature-game"><div class="feature-badge">⚡</div><div><b>MIX-UP</b><span>10 questions • all skills</span></div><button data-mode="mix">PLAY →</button></div><div class="mode-list">${listMode('numberPlayer','#','NUMBER → PLAYER','See the jersey number, name the player.')}${listMode('playerNumber','01','PLAYER → NUMBER','See name + position, recall the number.')}${listMode('playerPosition','♟','PLAYER → POSITION','See name + number, recall the position.')}${listMode('photoPlayer','▣','VISUAL IQ','Uniform-photo recognition.')}${listMode('hidden','◉','ELITE MODE','Hidden-number recall.')}</div><section class="recent"><div class="section-head"><span>RECENT ROUNDS</span></div>${(state.history.length?state.history:[{correct:0,score:0}]).slice(-6).reverse().map((h,i)=>`<div class="round-row"><span>ROUND ${state.history.length-i}</span><b>${h.correct}/10</b><em>${h.score} IQ</em></div>`).join('')}</section>`,'screen')}
function season(){const g=SCHEDULE[0]||{opponent:'Wisconsin',date:'2026-09-06',time:'7:30 PM ET',venue:'Lambeau Field'};const fmt=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}).toUpperCase();return shell(`<section class="page-head"><div><h1>SEASON</h1><p>2026 NOTRE DAME FOOTBALL</p></div></section><div class="season-hero"><div class="team-mark">ND</div><div><b>VS ${esc(g.opponent)}</b><span>${fmt(g.date)} • ${esc(g.time||'TBA')}</span><small>${esc(g.venue||'')}</small></div><button data-action="gameprep">PREP →</button></div><div class="season-grid"><div><b>${ROSTER.length}</b><span>ROSTER PLAYERS</span></div><div><b>${unique('num').length}</b><span>UNIQUE NUMBERS</span></div><div><b>${unique('pos').length}</b><span>POSITIONS</span></div></div><div class="more-card"><div class="eyebrow">2026 SCHEDULE</div><div class="schedule-list">${SCHEDULE.map((x,i)=>`<div class="schedule-row"><b>${String(i+1).padStart(2,'0')}</b><span><strong>${esc(x.opponent)}</strong><small>${fmt(x.date)} • ${esc(x.time||'TBA')}</small></span><em>${esc(x.venue||'')}</em></div>`).join('')}</div></div>`,'screen')}
function more(){return shell(`<section class="page-head"><div><h1>MORE</h1><p>APP INFO & SETTINGS</p></div></section><div class="more-card"><div class="eyebrow">ROSTER</div><h3>2026–27 VERIFIED ROSTER</h3><p>Duplicate jersey numbers are intentionally supported. Number + position identifies a player.</p></div><div class="more-card"><div class="eyebrow">PHOTOS</div><h3>UNIFORM PHOTO LIBRARY</h3><p>Place player photos in <b>photos/</b>. The app searches multiple filename patterns and uses them throughout Home, Visual IQ, Progress and quiz modes.</p></div><div class="more-card"><div class="eyebrow">PROGRESS</div><h3>RESET IRISH IQ</h3><button class="gold-button" data-action="reset">RESET ALL PROGRESS</button></div>`,'screen')}
function gameprep(){const g=SCHEDULE[0]||{opponent:'Wisconsin',date:'2026-09-06',time:'7:30 PM ET',venue:'Lambeau Field'};return shell(`<section class="page-head"><button data-nav="home">‹</button><div><h1>GAME PREP</h1><p>GET READY FOR ${esc(g.opponent).toUpperCase()}</p></div></section><div class="prep-card"><div class="team-mark">ND</div><div><b>VS ${esc(g.opponent)}</b><span>${esc(g.date)}</span><small>${esc(g.venue||'')}</small></div></div><div class="prep-actions"><button data-mode="mix">MIX-UP</button><button data-mode="photoPlayer">VISUAL IQ</button><button data-mode="playerNumber">ROSTER CHALLENGE</button></div><div class="more-card"><div class="eyebrow">STUDY PLAN</div><h3>Know the Irish before kickoff.</h3><p>Review names, numbers, positions and faces, then take the mixed challenge.</p></div>`,'screen')}
function render(){if(state.view==='home')app.innerHTML=home();else if(state.view==='modes')app.innerHTML=chooseModes();else if(state.view==='quiz')app.innerHTML=quiz();else if(state.view==='games')app.innerHTML=games();else if(state.view==='progress')app.innerHTML=progress();else if(state.view==='season')app.innerHTML=season();else if(state.view==='more')app.innerHTML=more();else if(state.view==='gameprep')app.innerHTML=gameprep();bind()}
function bind(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{state.view=b.dataset.nav;state.current=null;save();render()});document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;state.view='quiz';state.round=1;state.roundCorrect=0;state.roundScore=0;state.current=null;newQuestion()});document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action));document.querySelectorAll('[data-ptab]').forEach(b=>b.onclick=()=>{state.progressTab=b.dataset.ptab;save();render()});document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>answer(b));document.querySelectorAll('[data-player]').forEach(b=>b.onclick=()=>{const p=ROSTER.find(x=>x.name===b.dataset.player);if(p)showPlayer(p)})}
function showPlayer(p){const modal=document.createElement('div');modal.className='modal';modal.innerHTML=`<div class="player-modal"><button class="close">×</button><div class="modal-photo">${photo(p)}</div><div class="eyebrow">PLAYER PROFILE</div><h2>${esc(p.name)}</h2><div class="modal-meta"><b>#${esc(p.num)}</b><span>${esc(p.pos)}</span></div></div>`;document.body.appendChild(modal);modal.querySelector('.close').onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()}}
function action(a){if(a==='next'){state.round++;if(state.round>10){state.history.push({score:state.roundScore,correct:state.roundCorrect});state.view='games';state.round=1;state.roundCorrect=0;state.current=null;save();render()}else{state.current=null;newQuestion()}}else if(a==='skip'){state.streak=0;state.round++;if(state.round>10){state.history.push({score:state.roundScore,correct:state.roundCorrect});state.view='games';state.round=1;state.roundCorrect=0;state.current=null}else state.current=null;save();render()}else if(a==='fifty'){if(state.boosts<=0||state.fifty||state.locked)return;state.boosts--;state.fifty=true;const wrong=sh([...document.querySelectorAll('.answer')]).filter(b=>b.dataset.answer!==promptData().answer).slice(0,2);wrong.forEach(b=>b.style.visibility='hidden');save()}else if(a==='reset'){if(confirm('Reset all Irish Player IQ progress?')){localStorage.removeItem(KEY);location.reload()}}else if(a==='gameprep'){state.view='gameprep';render()}}
hydrateData();
})();
