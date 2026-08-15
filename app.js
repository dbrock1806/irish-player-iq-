(()=>{
'use strict';
const KEY='irish-player-iq-final-v14';
const app=document.getElementById('app');
let ROSTER=[],SCHEDULE=[],RANKINGS={},OPPONENTS={},RESULTS={},STATS={},HISTORY=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const unique=a=>[...new Set(a)];
const classLabel=p=>p.class||'Class not listed';
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
let state=Object.assign({view:'home',mode:null,score:0,streak:0,best:0,round:1,roundCorrect:0,roundQuestions:0,locked:false,current:null,activeQuestion:null,questionData:null,progress:{},learning:{},prep:{},post:{},history:[],teamName:'Notre Dame'},load());
const TEAM_CACHE={};
const TEAM_SLUGS={
 'Notre Dame':'notre-dame','Wisconsin':'wisconsin','Rice':'rice','Michigan State':'michigan-state','Purdue':'purdue','North Carolina':'north-carolina','Stanford':'stanford','BYU':'byu','Navy':'navy','Miami (FL)':'miami','Boston College':'boston-college','SMU':'smu','Syracuse':'syracuse'
};
const TEAM_OFFICIAL={
 'Notre Dame':'https://fightingirish.com/sports/football/schedule/season/1907-08/',
 'Wisconsin':'https://uwbadgers.com/sports/football/schedule',
 'Rice':'https://riceowls.com/sports/football/schedule',
 'Michigan State':'https://msuspartans.com/sports/football/schedule/',
 'Purdue':'https://purduesports.com/sports/football/schedule/season/2026',
 'North Carolina':'https://goheels.com/sports/football/schedule',
 'Stanford':'https://gostanford.com/sports/football/schedule',
 'BYU':'https://byucougars.com/sports/football/schedule/season/2026',
 'Navy':'https://navysports.com/sports/football/schedule',
 'Miami (FL)':'https://miamihurricanes.com/sports/football/schedule/',
 'Boston College':'https://bceagles.com/sports/football/schedule',
 'SMU':'https://smumustangs.com/sports/football/schedule',
 'Syracuse':'https://cuse.com/sports/football/schedule/46431'
};

state.learning=Object.assign({cohort:[],maintenance:[],mastery:{},round:1,sessionQuestions:0,historyPlayers:[],historyTypes:[],introduced:[]},state.learning||{});
if(state.learning.schema!==3){state.learning={cohort:[],maintenance:[],mastery:{},round:1,sessionQuestions:0,historyPlayers:[],historyTypes:[],introduced:[],finished:false,schema:3};}else{state.learning.schema=3;}
state.history=Object.assign({used:[],difficulty:1,questionIndex:0,gameOver:false,correct:0},state.history||{});
function clamp(v){v=Number(v||0);return Math.max(0,Math.min(100,v))}
function rec(name){return state.learning.mastery[name]||{number:0,player:0,position:0,class:0,attempts:0,correct:0,consecutive:0,last7:[],good:false,mastered:false,goodAt:0,postGood:{number:0,player:0,position:0,class:0}}}
function initLearning(){
 const old=state.learning.mastery||{};
 state.learning.mastery={};
 ROSTER.forEach(p=>{
   const o=old[p.name]||{};
   state.learning.mastery[p.name]={
     number:clamp(o.number),player:clamp(o.player),position:clamp(o.position),class:clamp(o.class),
     attempts:Number(o.attempts||0),correct:Number(o.correct||0),consecutive:Number(o.consecutive||0),
     last7:Array.isArray(o.last7)?o.last7.slice(-7):[],
     good:!!o.good,mastered:!!o.mastered,goodAt:Number(o.goodAt||0),
     skillCorrect:Object.assign({number:0,player:0,position:0,class:0},o.skillCorrect||{}),
     skillWrong:Object.assign({number:0,player:0,position:0,class:0},o.skillWrong||{}),
     postGood:Object.assign({number:0,player:0,position:0,class:0},o.postGood||{})
   };
 });
 if(!Array.isArray(state.learning.cohort)||state.learning.cohort.length!==6||new Set(state.learning.cohort).size!==6){
   const introduced=new Set(Array.isArray(state.learning.introduced)?state.learning.introduced:[]);
   const fresh=shuffle(ROSTER.filter(p=>!introduced.has(p.name))).slice(0,6);
   state.learning.cohort=fresh.map(p=>p.name);
   state.learning.introduced=[...new Set([...introduced,...fresh.map(p=>p.name)])];
 }
 if(!Array.isArray(state.learning.maintenance))state.learning.maintenance=[];
 if(!Array.isArray(state.learning.historyPlayers))state.learning.historyPlayers=[];
 if(!Array.isArray(state.learning.historyTypes))state.learning.historyTypes=[];
}
function overall(name){const r=rec(name);return Math.round((r.number+r.player+r.position+r.class)/4)}
function comfortable(name){const r=rec(name);return !!r.good}
function mastered(name){const r=rec(name);return !!r.mastered}
function core(){return state.learning.cohort.map(n=>ROSTER.find(p=>p.name===n)).filter(Boolean)}
function activeLearning(){return unique([...state.learning.cohort,...state.learning.maintenance]).map(n=>ROSTER.find(p=>p.name===n)).filter(Boolean)}
function identityKey(p){return `${p.num}|${p.pos}`}
function playerChoices(correct,pool=ROSTER){
 const others=pool.filter(p=>p.name!==correct.name&&identityKey(p)!==identityKey(correct));
 return shuffle([correct.name,...shuffle(others).slice(0,3).map(p=>p.name)]);
}
function safeChoices(correct,values){return shuffle([correct,...shuffle(unique(values.filter(v=>v!==correct))).slice(0,3)])}
function updateLearningMastery(name,skill,correct){
 const r=rec(name);
 const delta=correct?20:-15;
 r[skill]=clamp(r[skill]+delta);
 r.attempts++;
 if(correct){
   r.correct++;r.consecutive++;
   r.skillCorrect[skill]=(r.skillCorrect[skill]||0)+1;
 }else{
   r.consecutive=0;
   r.skillWrong[skill]=(r.skillWrong[skill]||0)+1;
 }
 r.last7=[...r.last7,correct?1:0].slice(-7);
 // Universal "good understanding": any player gets this label after either
 // 5 consecutive correct answers OR 6/7 correct, provided the four-skill
 // average is at least 65. This is deliberately separate from round completion.
 const goodByStreak=r.consecutive>=5;
 const goodByWindow=r.last7.length>=7&&r.last7.reduce((a,b)=>a+b,0)>=6;
 const overallNow=overall(name);
 if(!r.good&&(goodByStreak||goodByWindow)&&overallNow>=65){r.good=true;r.goodAt=Date.now()}
 if(r.good&&correct)r.postGood[skill]=(r.postGood[skill]||0)+1;
 // Full mastery requires every skill to have at least two correct answers,
 // each skill to be at 90+, and at least one reinforcement after "good".
 const skillReady=['number','player','position','class'].every(k=>(r.skillCorrect[k]||0)>=2 && r[k]>=90);
 const postGoodReady=['number','player','position','class'].every(k=>(r.postGood[k]||0)>=1);
 if(r.good&&skillReady&&postGoodReady&&overallNow>=90)r.mastered=true;
 state.learning.mastery[name]=r;
}
function roundReady(name){
 const r=rec(name);
 return ['number','player','position','class'].every(k=>(r.skillCorrect[k]||0)>=2);
}
function roundReadyAll(){return core().length===6&&core().every(p=>roundReady(p.name))}
function learningComplete(){return roundReadyAll()}
function maybeMaintain(){
 const oldCore=core().map(p=>p.name);
 const reviewCandidates=ROSTER.filter(p=>!state.learning.cohort.includes(p.name)&&mastered(p.name));
 state.learning.maintenance=unique([...state.learning.maintenance,...oldCore,...reviewCandidates]).slice(-12);
}
function chooseNextCohort(){
 const introduced=new Set(state.learning.introduced||[]);
 return shuffle(ROSTER.filter(p=>!introduced.has(p.name))).slice(0,6);
}
function advanceLearningRound(){
 const next=chooseNextCohort();
 if(!next.length){state.learning.finished=true;return false;}
 maybeMaintain();
 state.learning.cohort=next.map(p=>p.name);
 state.learning.introduced=[...new Set([...(state.learning.introduced||[]),...next.map(p=>p.name)])];
 state.learning.round=(state.learning.round||1)+1;
 state.learning.sessionQuestions=0;
 state.learning.historyPlayers=[];
 state.learning.historyTypes=[];
 return true;
}
function chooseLearning(){
 const cores=core();
 const review=state.learning.maintenance.map(n=>ROSTER.find(p=>p.name===n)).filter(Boolean).filter(p=>!state.learning.cohort.includes(p.name));
 let p;
 if(review.length&&Math.random()<0.25){
   const weakest=review.slice().sort((a,b)=>overall(a.name)-overall(b.name)).slice(0,Math.min(4,review.length));
   p=weakest[Math.floor(Math.random()*weakest.length)];
 }else{
   const weighted=cores.map(p=>({p,w:Math.max(1,110-overall(p.name))}));
   const total=weighted.reduce((a,x)=>a+x.w,0);let roll=Math.random()*total;
   for(const x of weighted){roll-=x.w;if(roll<=0){p=x.p;break;}}
   p=p||cores[0];
 }
 const r=rec(p.name);
 const needs=[];
 if((r.skillCorrect.number||0)<2)needs.push('playerNumber');
 if((r.skillCorrect.player||0)<2)needs.push('numberPlayer');
 if((r.skillCorrect.position||0)<2)needs.push('playerPosition');
 if((r.skillCorrect.class||0)<2)needs.push('playerClass');
 let type=shuffle(needs.length?needs:['playerNumber','numberPlayer','playerPosition','playerClass'])[0];
 const recentP=state.learning.historyPlayers||[],recentT=state.learning.historyTypes||[];
 for(let i=0;i<8&&recentP.includes(p.name)&&cores.length>1;i++){
   const alt=cores.filter(x=>!recentP.slice(-2).includes(x.name));
   if(alt.length)p=alt[Math.floor(Math.random()*alt.length)];
 }
 for(let i=0;i<6&&recentT.slice(-2).includes(type)&&needs.length>1;i++)type=shuffle(needs.filter(x=>x!==type))[0];
 state.learning.historyPlayers=[...recentP,p.name].slice(-5);
 state.learning.historyTypes=[...recentT,type].slice(-5);
 return {p,type};
}
function learningIntro(){
 const players=core();
 const complete=state.learning.finished;
 if(complete)return shell(`<section class="learning-complete"><div class="complete-mark">☘</div><div class="eyebrow">ROSTER COMPLETE</div><h1>YOU KNOW THE IRISH</h1><p>You have completed every learning cohort in the current roster.</p><div class="learning-summary"><b>${ROSTER.length}</b><span>PLAYERS INTRODUCED</span><b>${ROSTER.filter(p=>mastered(p.name)).length}</b><span>FULLY MASTERED</span></div><button class="gold-button" data-action="learningRestart">START OVER</button></section>`,'screen quiz-screen');
 const introLabel=state.learning.round===1?'ROUND 1 • START':'ROUND '+state.learning.round+' • NEW PLAYERS';
 return shell(`<section class="learning-intro"><div class="eyebrow">LEARNING MODE</div><div class="round-badge">${esc(introLabel)}</div><h1>MEET YOUR NEXT 6</h1><p>Study these players first. You'll be tested on their <b>name, number, position and class</b>. Previously learned players will return for review.</p><div class="intro-grid">${players.map(p=>`<div class="intro-player"><span class="intro-num">#${esc(p.num)}</span><b>${esc(p.name)}</b><small>${esc(p.pos)} • ${esc(classLabel(p))}</small></div>`).join('')}</div><div class="intro-footer"><span>CORE PLAYERS</span><b>6</b><button class="gold-button" data-action="startLearningRound">START ROUND ${state.learning.round} →</button></div></section>`,'screen quiz-screen');
}
function makeQuestion(){
 if(state.mode==='learning')return makeLearning();
 if(state.mode==='elite')return makeElite();
 if(state.mode==='prep')return makePrep();
 if(state.mode==='postgame')return makePostgame();
 if(state.mode==='history')return makeHistoryQuestion();
 return makeQuick();
}
function makeLearning(){const x=chooseLearning();state.current=x.p;state.activeQuestion=x.type;return buildPlayerQuestion(x.p,x.type,'LEARNING')}
function buildPlayerQuestion(p,type,tag){
 const pool=activeLearning();
 if(type==='playerNumber')return {label:`${tag} • PLAYER → NUMBER`,title:'WHAT IS HIS JERSEY NUMBER?',support:`${p.name} • ${p.pos} • ${classLabel(p)}`,answer:p.num,choices:safeChoices(p.num,ROSTER.map(x=>x.num)),skill:'number',learn:`${p.name} is ${classLabel(p)} and plays ${p.pos}. His jersey number is #${p.num}.`};
 if(type==='numberPlayer')return {label:`${tag} • NUMBER + POSITION → PLAYER`,title:'WHO IS THIS PLAYER?',support:`#${p.num} • ${p.pos} • ${classLabel(p)}`,answer:p.name,choices:playerChoices(p,unique([...pool,...ROSTER])),skill:'player',learn:`#${p.num} at ${p.pos} is ${p.name} (${classLabel(p)}).`};
 if(type==='playerPosition')return {label:`${tag} • PLAYER → POSITION`,title:'WHAT POSITION DOES HE PLAY?',support:`${p.name} • #${p.num} • ${classLabel(p)}`,answer:p.pos,choices:safeChoices(p.pos,ROSTER.map(x=>x.pos)),skill:'position',learn:`${p.name} wears #${p.num}, is a ${classLabel(p)}, and plays ${p.pos}.`};
 if(type==='playerClass')return {label:`${tag} • PLAYER → CLASS`,title:'WHAT CLASS IS HE?',support:`${p.name} • #${p.num} • ${p.pos}`,answer:p.class,choices:safeChoices(p.class,ROSTER.map(x=>x.class)),skill:'class',learn:`${p.name} wears #${p.num}, plays ${p.pos}, and is a ${p.class}.`};
 if(type==='numberClassPlayer')return {label:`${tag} • NUMBER + CLASS → PLAYER`,title:'WHO IS THIS PLAYER?',support:`#${p.num} • ${p.class} • POSITION HIDDEN`,answer:p.name,choices:playerChoices(p,pool.filter(x=>x.class===p.class||x.num===p.num)),skill:'player',learn:`${p.name} is #${p.num}, a ${p.class}, and plays ${p.pos}.`};
 return {label:`${tag} • CLASS + POSITION + NUMBER → PLAYER`,title:'WHO IS THIS PLAYER?',support:`${p.class} • ${p.pos} • #${p.num}`,answer:p.name,choices:playerChoices(p,unique([...pool,...ROSTER])),skill:'player',learn:`${p.name} is the ${p.class} player wearing #${p.num} at ${p.pos}.`};
}
function makeQuick(){state.current=ROSTER[Math.floor(Math.random()*ROSTER.length)];state.activeQuestion=shuffle(['numberPlayer','playerNumber','playerPosition'])[0];return buildPlayerQuestion(state.current,state.activeQuestion,'QUICK PLAY')}
function makeElite(){
  state.current=ROSTER[Math.floor(Math.random()*ROSTER.length)];
  // Elite only uses clue combinations that uniquely identify one player.
  // This prevents duplicate jersey numbers or common class/position pairs from creating two correct answers.
  state.activeQuestion=shuffle(['playerNumber','playerPosition','playerClass','eliteIdentity'])[0];
  const p=state.current;
  if(state.activeQuestion==='playerNumber') return {label:'ELITE • NAME + POSITION + CLASS → NUMBER',title:'WHAT IS HIS JERSEY NUMBER?',support:`${p.name} • ${p.pos} • ${classLabel(p)}`,answer:p.num,choices:safeChoices(p.num,ROSTER.map(x=>x.num)),skill:'number',learn:`${p.name} is a ${classLabel(p)} at ${p.pos}. He wears #${p.num}.`};
  if(state.activeQuestion==='playerPosition') return {label:'ELITE • NAME + NUMBER + CLASS → POSITION',title:'WHAT POSITION DOES HE PLAY?',support:`${p.name} • #${p.num} • ${classLabel(p)}`,answer:p.pos,choices:safeChoices(p.pos,ROSTER.map(x=>x.pos)),skill:'position',learn:`${p.name} is #${p.num} and ${classLabel(p)}. His position is ${p.pos}.`};
  if(state.activeQuestion==='playerClass') return {label:'ELITE • NAME + NUMBER + POSITION → CLASS',title:'WHAT CLASS IS HE?',support:`${p.name} • #${p.num} • ${p.pos}`,answer:p.class,choices:safeChoices(p.class,ROSTER.map(x=>x.class)),skill:'class',learn:`${p.name} wears #${p.num}, plays ${p.pos}, and is a ${p.class}.`};
  return {label:'ELITE • NUMBER + POSITION + CLASS → PLAYER',title:'WHO IS THIS PLAYER?',support:`#${p.num} • ${p.pos} • ${classLabel(p)}`,answer:p.name,choices:playerChoices(p,ROSTER),skill:'player',learn:`#${p.num} at ${p.pos} for a ${classLabel(p)} player is ${p.name}.`};
}
function historyDifficulty(index){
 const priorCorrect=state.history?.correct||0;
 const jitter=Math.random()*2-1;
 return Math.max(1,Math.min(10,Math.round(1+0.85*index+0.35*priorCorrect+0.20*jitter)));
}
function makeHistoryQuestion(){
 const target=historyDifficulty(state.history.questionIndex||0);
 const unused=HISTORY.filter(q=>!(state.history.used||[]).includes(q.id));
 const pool=unused.length?unused:HISTORY;
 const ranked=pool.map(q=>({q,score:Math.abs(q.difficulty-target)+Math.random()*1.25})).sort((a,b)=>a.score-b.score);
 const q=ranked.slice(0,Math.min(5,ranked.length))[Math.floor(Math.random()*Math.min(5,ranked.length))].q;
 state.history.used=[...(state.history.used||[]),q.id];
 state.history.difficulty=q.difficulty;
 state.current={history:q};
 return {label:`HISTORY • LEVEL ${q.difficulty}`,title:q.question,support:q.category,answer:q.answer,choices:shuffle(q.choices),learn:q.learn||`Correct answer: ${q.answer}`,difficulty:q.difficulty};
}
function makePrep(){
 const g=nextGame(),o=OPPONENTS[g.opponent]||{};state.current={opponent:g.opponent};
 const qs=o.questions||[];return qs.length?qs[Math.floor(Math.random()*qs.length)]:{label:'GAME PREP • OPPONENT',title:`GET READY FOR ${g.opponent.toUpperCase()}`,support:`${g.date} • ${g.venue}`,answer:'Continue',choices:['Continue','Review matchup','Study opponent','Finish prep'],learn:'Prep content will be populated from verified opponent data.'};
}
function makePostgame(){
 const g=latestFinalGame(),data=RESULTS.games?.find(x=>x.date===g?.date)||{};const qs=data.questions||[];state.current={game:g};return qs.length?qs[Math.floor(Math.random()*qs.length)]:{label:'POST-GAME • REVIEW',title:'POST-GAME QUIZ UNAVAILABLE',support:'Official game results and stats are not available yet.',answer:'OK',choices:['OK'],learn:'Post-game mode unlocks automatically after an official result is added.'};
}
function nextGame(){const now=new Date('2026-08-14T20:00:00-04:00');const upcoming=SCHEDULE.filter(g=>g.status!=='final'&&new Date(g.date+'T23:59:59')>=now).sort((a,b)=>a.date.localeCompare(b.date));return upcoming[0]||SCHEDULE[0]||{opponent:'Wisconsin',date:'2026-09-06',time:'7:30 PM ET',venue:'Lambeau Field'} }
function latestFinalGame(){return SCHEDULE.filter(g=>g.status==='final').sort((a,b)=>b.date.localeCompare(a.date))[0]||null}
function hasPostgame(){return !!latestFinalGame()}
function rankingsView(){return RANKINGS||{}}
function shell(body,cls='screen'){return `<div class="app">${top()}<main class="${cls}">${body}</main>${nav()}</div>`}
function top(){return `<div class="goldbar"></div><header class="topbar"><button class="top-icon" data-nav="home">ND</button><div class="brand"><b>IRISH PLAYER IQ</b><small>NOTRE DAME FOOTBALL • 2026–27</small></div></header>`}
function nav(){return `<nav class="bottomnav" aria-label="Primary navigation"><button class="navbtn ${state.view==='home'?'active':''}" data-nav="home" aria-label="Home"><span>⌂</span><em>HOME</em></button><button class="navbtn ${state.view==='progress'?'active':''}" data-nav="progress" aria-label="My Irish IQ"><span>◎</span><em>MY IRISH IQ</em></button><button class="navbtn ${state.view==='roster'?'active':''}" data-nav="roster" aria-label="Roster"><span>♙</span><em>ROSTER</em></button><button class="navbtn ${state.view==='season'?'active':''}" data-nav="season" aria-label="Schedule"><span>◷</span><em>SCHEDULE</em></button><button class="navbtn ${state.view==='more'?'active':''}" data-nav="more" aria-label="More"><span>•••</span><em>MORE</em></button></nav>`}
function home(){const g=nextGame();return shell(`<section class="home-hero"><div class="crest"><b>ND</b><span>FIGHTING IRISH</span></div><div class="kicker">LEARN THE IRISH. FOLLOW THE SEASON.</div><h1>PLAYER <strong>IQ</strong></h1><p>Learn every name, number, position and class — then see how much you really know.</p></section><section class="iq-panel"><div class="ring"><div><b>${Math.round(ROSTER.filter(p=>overall(p.name)>=70).length/ROSTER.length*100)}%</b><small>CONFIDENT</small></div></div><div class="iq-copy"><div class="eyebrow">YOUR IRISH IQ</div><div class="iq-stats"><span><b>${ROSTER.filter(p=>overall(p.name)>=70).length}</b> PLAYERS</span><span><b>${state.score}</b> IQ</span><span><b>${state.best}</b> BEST STREAK</span></div></div></section><section class="next-card"><div><div class="eyebrow">NEXT GAME</div><h2>VS ${esc(g.opponent)}</h2><p>${esc(g.date)} • ${esc(g.time||'TBA')}<br>${esc(g.venue||'')}</p></div><button class="gold-button" data-action="gameprep">GAME PREP <span>→</span></button></section><section class="section-head choose"><span>CHOOSE YOUR TRAINING</span><small>ALL GAME MODES</small></section><div class="home-modes">${homeMode('◎','LEARNING MODE','Adaptive roster training • small groups • spaced review.','learning')}${homeMode('⚡','QUICK PLAY','Fast mixed recall of name, number and position.','mix')}${homeMode('#','NUMBER → PLAYER','Number + position identify the player.','numberPlayer')}${homeMode('01','PLAYER → NUMBER','Name + position + class. Recall the number.','playerNumber')}${homeMode('♟','PLAYER → POSITION','Name + number + class. Recall the position.','playerPosition')}${homeMode('◆','ELITE MODE','Hard combinations: class, position, number and identity.','elite')}${homeMode('🏛','HISTORY MODE','Notre Dame university + football history. 10 questions, one miss ends the game.','history')}</div>${hasPostgame()?`<section class="postgame-available"><div><b>POST-GAME IQ AVAILABLE</b><span>Test what you remember from the latest game.</span></div><button data-action="postgame">START →</button></section>`:''}<section class="roster-home-link"><button data-nav="roster"><b>FULL NOTRE DAME ROSTER</b><span>Open and study every player.</span><i>→</i></button></section>`,'screen home-screen')}
function homeMode(icon,title,sub,mode){return `<button class="home-mode" data-mode="${mode}"><div class="mode-icon">${icon}</div><div><b>${title}</b><span>${sub}</span></div><i>›</i></button>`}
function visualForQuiz(p,m){if(!p||!p.name)return '';if(m==='numberPlayer')return `<div class="number-hero">#${esc(p.num)}</div><div class="support-prominent">${esc(p.pos)} • ${esc(classLabel(p))}</div>`;if(m==='playerNumber')return `<div class="identity-card"><div class="identity-badge">PLAYER</div><div><h2>${esc(p.name)}</h2><b class="prominent-context">${esc(p.pos)} • ${esc(classLabel(p))}</b></div></div>`;if(m==='playerPosition')return `<div class="identity-card"><div class="identity-number">#${esc(p.num)}</div><div><h2>${esc(p.name)}</h2><b class="prominent-context">${esc(classLabel(p))}</b></div></div>`;if(m==='playerClass')return `<div class="identity-card"><div class="identity-badge">CLASS</div><div><h2>${esc(p.name)}</h2><b>${esc(p.num)} • ${esc(p.pos)}</b></div></div>`;return `<div class="elite-context"><b>${esc(p.num)}</b><span>${esc(p.pos)} • ${esc(classLabel(p))}</span></div>`}
function quiz(){if(!state.questionData){state.questionData=makeQuestion()}const q=state.questionData;const p=state.current;const learning=state.mode==='learning';const prep=state.mode==='prep',post=state.mode==='postgame',history=state.mode==='history';let status='';if(learning)status=`<div class="learning-status"><div><b>LEARNING MODE</b><span>ROUND ${state.learning.round}</span></div><div><strong>${core().filter(p=>mastered(p.name)).length}/6</strong><span>CORE MASTERED</span></div><div><strong>${core().filter(p=>comfortable(p.name)).length}/6</strong><span>GOOD UNDERSTANDING</span></div></div>`;if(prep)status=`<div class="learning-status"><div><b>GAME PREP</b><span>LEARN THE OPPONENT</span></div><div><strong>${state.roundQuestions}</strong><span>STUDIED</span></div><div><strong>FINISH</strong><span>AT 8 QUESTIONS</span></div></div>`;if(post)status=`<div class="learning-status"><div><b>POST-GAME IQ</b><span>TEST MODE</span></div><div><strong>${state.roundQuestions}</strong><span>QUESTIONS</span></div><div><strong>NO HINTS</strong><span>TEST YOUR MEMORY</span></div>`;
if(history)status=`<div class="learning-status"><div><b>HISTORY MODE</b><span>10-QUESTION TEST</span></div><div><strong>${state.history.questionIndex||0}/10</strong><span>PROGRESS</span></div><div><strong>LEVEL ${state.history.difficulty||1}</strong><span>DIFFICULTY</span></div>`;return shell(`<div class="quiz-head"><div><span>${learning?'FOCUSED TRAINING':prep?'OPPONENT STUDY':post?'POST-GAME TEST':history?'HISTORY TEST':`ROUND ${state.round} / 10`}</span><b>${esc(q.label)}</b></div>${learning?'':'<div class="score-mini">'+state.score+'<small>IQ</small></div>'}</div>${status}<section class="quiz-card"><div class="eyebrow">${esc(q.label)}</div><h1>${esc(q.title)}</h1>${p.name?visualForQuiz(p,state.activeQuestion):''}<div class="support-line">${esc(q.support||'')}</div>${learning?`<div class="mastery-strip"><span>NUMBER ${rec(p.name).number}%</span><span>PLAYER ${rec(p.name).player}%</span><span>POSITION ${rec(p.name).position}%</span><span>CLASS ${rec(p.name).class}%</span><span>OVERALL ${overall(p.name)}%</span></div>`:''}<div class="answer-label">${post||history?'MAKE YOUR BEST ANSWER':'CHOOSE YOUR ANSWER'}</div><div class="answers">${q.choices.map((c,i)=>`<button class="answer" data-index="${i}" data-answer="${esc(c)}">${esc(c)}</button>`).join('')}</div>${!post&&!prep&&!history?`<div class="quiz-tools"><button class="tool" data-action="fifty">50/50</button><button class="tool" data-action="skip">SKIP</button></div>`:''}<div id="result"></div></section>`,'screen quiz-screen')}
function roster(){return shell(`<section class="page-head"><div><h1>ROSTER</h1><p>STUDY THE 2026–27 IRISH</p></div></section><div class="roster-intro">${ROSTER.length} players • Tap a player to study their name, number, position and class.</div><div class="roster-list">${ROSTER.map(p=>`<button class="roster-row" data-player="${esc(p.name)}"><div class="p-number">#${esc(p.num)}</div><div><b>${esc(p.name)}</b><small>${esc(p.pos)} • ${esc(classLabel(p))}</small></div><strong>${overall(p.name)}%</strong></button>`).join('')}</div>`,'screen roster-screen')}
function progress(){const confident=ROSTER.filter(p=>overall(p.name)>=70).length;return shell(`<section class="page-head"><div><h1>MY IRISH IQ</h1><p>MASTER THE ROSTER</p></div></section><div class="big-progress"><div class="big-pct">${Math.round(confident/ROSTER.length*100)}%</div><div><b>CONFIDENT</b><span>${confident} of ${ROSTER.length} players at 70%+</span></div></div><div class="progress-list">${ROSTER.map(p=>`<div class="p-row"><div class="p-number">#${esc(p.num)}</div><div><b>${esc(p.name)}</b><small>${esc(p.pos)} • ${esc(classLabel(p))}</small></div><strong>${overall(p.name)}%</strong></div>`).join('')}</div>`,'screen')}
function season(){const g=nextGame(),r=rankingsView();return shell(`<section class="page-head"><div><h1>SCHEDULE</h1><p>2026 NOTRE DAME FOOTBALL</p></div></section><div class="ranking-grid"><div><span>RECORD</span><b>${esc(r.record||'0–0')}</b></div><div><span>AP</span><b>${esc(r.ap||'NR')}</b><small>${esc(r.apNote||'')}</small></div><div><span>COACHES</span><b>${esc(r.coaches||'No. 5')}</b></div><div><span>CFP</span><b>${esc(r.cfp||'NR')}</b><small>${esc(r.cfpNote||'')}</small></div></div><div class="season-hero"><div class="team-mark">ND</div><div><b>VS ${esc(g.opponent)}</b><span>${esc(g.date)} • ${esc(g.time||'TBA')}</span><small>${esc(g.venue||'')}</small></div><button data-action="gameprep">PREP →</button></div>${hasPostgame()?`<div class="postgame-available"><div><b>POST-GAME MODE</b><span>Official result available — test your game knowledge.</span></div><button data-action="postgame">START →</button></div>`:''}<div class="more-card"><div class="eyebrow">FULL 2026 SCHEDULE</div>${SCHEDULE.map((x,i)=>`<button class="schedule-row schedule-click" data-team="${esc(x.opponent)}"><b>${String(i+1).padStart(2,'0')}</b><span><strong>${esc(x.opponent)}</strong><small>${esc(x.date)} • ${esc(x.time||'TBA')}</small></span><em>${esc(x.venue||'')}</em>${x.status==='final'?`<mark class="${x.result==='W'?'win':x.result==='L'?'loss':''}">${esc(x.result||'FINAL')} ${esc(x.score||'')}</mark>`:`<mark class="upcoming">UPCOMING</mark>`}</button>`).join('')}<div class="playoff-note"><b>CFP</b><span>Playoff games will be added here automatically if Notre Dame qualifies.</span></div></div>`,'screen season-screen')}
function more(){return shell(`<section class="page-head"><div><h1>MORE</h1><p>APP INFO & SETTINGS</p></div></section><div class="more-card"><div class="eyebrow">IRISH PLAYER IQ</div><h3>LEARN THE IRISH. FOLLOW THE SEASON.</h3><p>Learning Mode progressively teaches the roster. Quick Play tests recall. Game Prep teaches the opponent. Post-Game tests what happened. Season keeps the schedule, rankings and results current.</p></div><div class="more-card"><div class="eyebrow">RANKING SOURCES</div><p>AP and Coaches rankings are updated when official polls are released. CFP rankings remain unavailable until the Selection Committee begins its 2026 rankings on Nov. 3.</p></div><div class="more-card"><button class="gold-button" data-action="reset">RESET ALL PROGRESS</button></div>`,'screen')}
function teamSlug(name){if(TEAM_SLUGS[name])return TEAM_SLUGS[name];return String(name).toLowerCase().replace(/\(fl\)|\(miami\)/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
async function fetchTeamSchedule(name){const slug=teamSlug(name);const urls=[`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${encodeURIComponent(slug)}/schedule?season=2026`,`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${encodeURIComponent(slug)}/schedule`];for(const u of urls){try{const r=await fetch(u,{cache:'no-store'});if(r.ok){const d=await r.json();if(Array.isArray(d.events))return d}}catch(e){}}return null}
async function fetchTeamInfo(name){const slug=teamSlug(name);try{const r=await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${encodeURIComponent(slug)}?enable=roster`,{cache:'no-store'});if(r.ok)return await r.json()}catch(e){}return null}
async function fetchTeamRoster(name){const slug=teamSlug(name);try{const r=await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${encodeURIComponent(slug)}/roster?limit=200`,{cache:'no-store'});if(r.ok){const d=await r.json();if(Array.isArray(d.athletes))return d.athletes}}catch(e){}return []}
function normalizeTeamEvents(name,events){return events.map(ev=>{const c=(ev.competitions||[])[0]||{};const teams=c.competitors||[];const me=teams.find(x=>String(x.team?.displayName||'').toLowerCase()===String(name).toLowerCase())||teams.find(x=>x.homeAway==='home')||{};const opp=teams.find(x=>x!==me)||{};const final=!!c.status?.type?.completed;const myScore=me.score!=null?Number(me.score):null;const oppScore=opp.score!=null?Number(opp.score):null;return {id:ev.id,date:ev.date?ev.date.slice(0,10):'',time:c.date?new Date(c.date).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):'',opponent:opp.team?.displayName||'Opponent',site:me.homeAway==='home'?'Home':me.homeAway==='away'?'Away':'Neutral',venue:c.venue?.fullName||'',status:final?'final':'scheduled',result:final?(me.winner?'W':opp.winner?'L':(myScore!=null&&oppScore!=null&&myScore===oppScore?'T':'')):'',score:final&&myScore!=null&&oppScore!=null?`${myScore}–${oppScore}`:'',myScore,oppScore}}).sort((a,b)=>a.date.localeCompare(b.date))}
function teamRecord(games){let w=0,l=0,t=0;games.forEach(g=>{if(g.result==='W')w++;else if(g.result==='L')l++;else if(g.result==='T')t++});return `${w}-${l}${t?`-${t}`:''}`}
function teamRank(info){const t=info?.team||info||{};return t.rank??t.currentRank??'NR'}
async function openTeam(name){state.teamName=name;state.view='team';state.mode=null;save();render();const [sd,info,roster]=await Promise.all([fetchTeamSchedule(name),fetchTeamInfo(name),fetchTeamRoster(name)]);const games=sd?normalizeTeamEvents(name,sd.events||[]):[];TEAM_CACHE[name]={games,info,roster,verifiedAt:new Date().toISOString(),source:'ESPN live schedule/roster endpoint'};render()}
function team(){const name=state.teamName||'Notre Dame';const d=TEAM_CACHE[name];if(!d)return shell(`<section class="team-loading"><div class="eyebrow">TEAM EXPLORER</div><h1>${esc(name)}</h1><p>Loading the verified schedule and roster…</p></section>`,'screen team-screen');const info=d.info?.team||d.info||{};const games=d.games||[];const record=info.record?.items?.[0]?.summary||teamRecord(games);const rank=teamRank(d.info);const official=TEAM_OFFICIAL[name]||'';return shell(`<section class="page-head"><div><button class="back-button" data-nav="season">‹ BACK</button><h1>${esc(name)}</h1><p>2026 FOOTBALL • CONNECTED TEAM VIEW</p></div></section><div class="team-summary"><div class="team-mark">${esc((info.abbreviation||name.split(/\\s+/).map(x=>x[0]).join('')).slice(0,3))}</div><div><b>${esc(record)}</b><span>${rank==='NR'?'UNRANKED':`RANKED #${esc(rank)}`}</span><small>Live data checked ${new Date(d.verifiedAt).toLocaleString()}</small></div></div><div class="team-actions"><button class="gold-button" data-action="teamRoster">VIEW FULL ROSTER →</button>${official?`<a class="source-link" href="${esc(official)}" target="_blank" rel="noopener">OFFICIAL SCHEDULE ↗</a>`:''}</div><div class="more-card"><div class="eyebrow">2026 SCHEDULE</div>${games.length?games.map((g,i)=>`<button class="schedule-row schedule-click" data-team="${esc(g.opponent)}"><b>${String(i+1).padStart(2,'0')}</b><span><strong>${esc(g.site==='Away'?'@ ':'vs ')}${esc(g.opponent)}</strong><small>${esc(g.date)} • ${esc(g.time||'TBA')}</small></span><em>${esc(g.venue||'')}</em>${g.status==='final'?`<mark class="${g.result==='W'?'win':g.result==='L'?'loss':''}">${esc(g.result)} ${esc(g.score)}</mark>`:'<mark class="upcoming">UPCOMING</mark>'}</button>`).join(''):`<div class="empty-state">Live schedule data was not returned. Use the official schedule above.</div>`}</div><div id="team-roster"></div><div class="explorer-note">Every opponent in this schedule is clickable. Open an opponent, then open one of <em>their</em> opponents to continue exploring the college-football schedule graph.</div>`,'screen team-screen')}
function teamRoster(){const name=state.teamName,d=TEAM_CACHE[name]||{},rows=d.roster||[];document.getElementById('team-roster').innerHTML=`<div class="more-card"><div class="eyebrow">FULL ${esc(name.toUpperCase())} ROSTER</div>${rows.length?`<div class="external-roster-list">${rows.map(p=>`<div class="p-row"><div class="p-number">#${esc(p.jersey||'—')}</div><div><b>${esc(p.fullName||p.displayName||'Unknown')}</b><small>${esc(p.position?.abbreviation||p.position?.name||'Position not listed')} • ${esc(p.classYear||p.experience?.displayValue||'Class not listed')}</small></div></div>`).join('')}</div>`:`<div class="empty-state">Roster data was not returned by the live source. The official roster link can be used instead.</div>`}</div>`;document.getElementById('team-roster').scrollIntoView({behavior:'smooth',block:'start'});}
function prep(){const g=nextGame(),o=OPPONENTS[g.opponent]||{};state.mode='prep';state.view='quiz';state.roundQuestions=0;state.current=null;state.activeQuestion=null;return quiz()}
function postgame(){state.mode='postgame';state.view='quiz';state.roundQuestions=0;state.current=null;state.activeQuestion=null;return quiz()}
function answer(btn){
 if(state.locked)return;
 state.locked=true;
 const q=state.questionData||makeQuestion();
 const selected=btn.dataset.answer;
 const correct=selected===q.answer;
 document.querySelectorAll('.answer').forEach(b=>b.disabled=true);
 if(correct){
   btn.classList.add('correct');
   state.score+=state.mode==='postgame'?500:state.mode==='history'?Math.round(300+q.difficulty*60):350;
   state.streak++;state.best=Math.max(state.best,state.streak);
   if(q.skill && state.current && state.current.name){updateLearningMastery(state.current.name,q.skill,true);}
   if(state.mode==='prep')state.prep.correct=(state.prep.correct||0)+1;
   if(state.mode==='postgame')state.post.correct=(state.post.correct||0)+1;
   if(state.mode==='history')state.history.correct=(state.history.correct||0)+1;
 }else{
   btn.classList.add('wrong');state.streak=0;
   document.querySelectorAll('.answer').forEach(b=>{if(b.dataset.answer===q.answer)b.classList.add('correct')});
   if(q.skill && state.current && state.current.name){updateLearningMastery(state.current.name,q.skill,false);}
   if(state.mode==='history')state.history.gameOver=true;
 }
 if(state.mode==='learning')state.learning.sessionQuestions++;
 if(state.mode==='prep'||state.mode==='postgame')state.roundQuestions++;
 if(state.mode==='history')state.history.questionIndex++;
 save();
 const reveal=`<div class="learn-result ${correct?'good':''}"><b>${correct?'✓ CORRECT':'LEARN IT: '+esc(q.answer)}</b><span>${esc(q.learn||'Review the information and try again.')}</span></div>`;
 let next='NEXT →';
 if(state.mode==='learning'&&learningComplete())next='COMPLETE ROUND →';
 if(state.mode==='prep'&&state.roundQuestions>=8)next='FINISH GAME PREP →';
 if(state.mode==='postgame'&&state.roundQuestions>=8)next='FINISH POST-GAME →';
 if(state.mode==='history'&&(!correct || state.history.questionIndex>=10))next=correct?'COMPLETE HISTORY GAME →':'GAME OVER — VIEW RESULTS →';
 if(state.mode!=='learning'&&state.mode!=='prep'&&state.mode!=='postgame'&&state.mode!=='history'&&state.roundQuestions>=10)next='FINISH ROUND →';
 document.getElementById('result').innerHTML=reveal+`<button class="continue" data-action="next">${next}</button>`;
 bind();
}
function action(a){if(a==='startLearningRound'){state.view='quiz';state.mode='learning';state.questionData=null;state.locked=false;newQuestion();return}if(a==='learningRestart'){state.learning={cohort:[],maintenance:[],mastery:{},round:1,sessionQuestions:0,historyPlayers:[],historyTypes:[],introduced:[],finished:false,schema:3};initLearning();state.view='learningIntro';state.mode=null;save();render();return}if(a==='next'){
 if(state.mode==='history'){
   if(state.history.gameOver||state.history.questionIndex>=10){
     state.view='home';state.mode=null;state.questionData=null;state.history={used:[],difficulty:1,questionIndex:0,gameOver:false,correct:0};save();render();return;
   }
   state.questionData=null;newQuestion();return;
 }
if(state.mode==='learning'){state.questionData=null;if(learningComplete()){if(advanceLearningRound()){state.mode=null;state.view='learningIntro';save();render();}else{state.learning.finished=true;state.mode=null;state.view='learningIntro';save();render();}}else{newQuestion()};return}if(state.mode==='prep'&&state.roundQuestions>=8){state.view='season';state.mode=null;state.questionData=null;save();render();return}if(state.mode==='postgame'&&state.roundQuestions>=8){state.view='season';state.mode=null;state.questionData=null;save();render();return}state.roundQuestions++;if(state.roundQuestions>=10){state.view='home';state.mode=null;state.roundQuestions=0}else newQuestion()}else if(a==='skip'){state.streak=0;if(state.mode==='learning'&&state.current&&state.questionData){updateLearningMastery(state.current.name,state.questionData.skill,false);state.learning.sessionQuestions++;save()}state.questionData=null;newQuestion()}else if(a==='fifty'){if(state.locked)return;const q=state.questionData||makeQuestion();shuffle([...document.querySelectorAll('.answer')]).filter(b=>b.dataset.answer!==q.answer).slice(0,2).forEach(b=>b.style.visibility='hidden')}else if(a==='gameprep'){state.view='gameprep';state.mode=null;state.questionData=null;render()}else if(a==='postgame'){state.mode='postgame';state.view='quiz';state.roundQuestions=0;state.current=null;state.questionData=null;newQuestion()}else if(a==='teamRoster'){teamRoster()}else if(a==='reset'&&confirm('Reset all Irish Player IQ progress?')){localStorage.removeItem(KEY);location.reload()}}
function gameprepPage(){const g=nextGame(),o=OPPONENTS[g.opponent]||{};return shell(`<section class="page-head"><div><h1>GAME PREP</h1><p>LEARN THE OPPONENT • ${esc(g.opponent.toUpperCase())}</p></div></section><div class="prep-card"><div class="team-mark">ND</div><div><b>VS ${esc(g.opponent)}</b><span>${esc(g.date)} • ${esc(g.time)}</span><small>${esc(g.venue)}</small></div></div><div class="opponent-facts"><div><span>COACH</span><b>${esc(o.coach||'Verified data pending')}</b></div><div><span>2025 RECORD</span><b>${esc(o.record||'Verified data pending')}</b></div><div><span>2026 COACHES</span><b>${esc(o.coachesRank||'NR')}</b></div><div><span>2026 AP</span><b>${esc(o.apRank||'NR / not released')}</b></div></div><div class="more-card"><div class="eyebrow">LEARNING FINISH LINE</div><p>Complete 8 opponent-focused questions. Game Prep teaches the matchup; it does not quiz you on Notre Dame roster facts.</p><button class="gold-button" data-mode="prep">START GAME PREP →</button></div>`,'screen')}
function rosterDetail(name){const p=ROSTER.find(x=>x.name===name);if(!p)return;app.innerHTML=shell(`<section class="page-head"><button data-nav="roster">‹</button><div><h1>PLAYER</h1><p>ROSTER STUDY</p></div></section><div class="player-detail"><div class="detail-number">#${esc(p.num)}</div><h2>${esc(p.name)}</h2><div class="detail-meta"><span>${esc(p.pos)}</span><span>${esc(classLabel(p))}</span><span>MASTERY ${overall(p.name)}%</span></div></div><div class="more-card"><div class="eyebrow">SKILL BREAKDOWN</div><div class="mastery-strip"><span>NUMBER ${rec(p.name).number}%</span><span>PLAYER ${rec(p.name).player}%</span><span>POSITION ${rec(p.name).position}%</span><span>CLASS ${rec(p.name).class}%</span><span>OVERALL ${overall(p.name)}%</span></div><button class="gold-button" data-mode="learning">TRAIN THIS PLAYER →</button></div>`, 'screen');bind()}
function newQuestion(){
 state.questionData=makeQuestion();
 state.locked=false;
 save();
 render();
}
function bind(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{state.view=b.dataset.nav;state.mode=null;save();render()});document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{
 state.mode=b.dataset.mode;state.view=(state.mode==='learning'?'learningIntro':'quiz');state.current=null;state.questionData=null;state.roundQuestions=0;
 if(state.mode==='history')state.history={used:[],difficulty:1,questionIndex:0,gameOver:false,correct:0};
 if(state.mode==='learning'){initLearning();save();render();}else{newQuestion();}
});document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action));document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>answer(b));document.querySelectorAll('[data-player]').forEach(b=>b.onclick=()=>rosterDetail(b.dataset.player));document.querySelectorAll('[data-team]').forEach(b=>b.onclick=()=>openTeam(b.dataset.team))}
function render(){if(state.view==='learningIntro')app.innerHTML=learningIntro();else if(state.view==='home')app.innerHTML=home();else if(state.view==='quiz')app.innerHTML=quiz();else if(state.view==='roster')app.innerHTML=roster();else if(state.view==='progress')app.innerHTML=progress();else if(state.view==='season')app.innerHTML=season();else if(state.view==='more')app.innerHTML=more();else if(state.view==='gameprep')app.innerHTML=gameprepPage();else if(state.view==='team')app.innerHTML=team();else app.innerHTML=home();bind()}
async function getJSON(file){const r=await fetch(file+'?v=20260815-v19',{cache:'no-store'});if(!r.ok)throw new Error(file);return r.json()}
async function boot(){try{const [rd,sd,rank,opp,res,stats,hist]=await Promise.all([getJSON('roster.json'),getJSON('schedule.json'),getJSON('rankings.json'),getJSON('opponents.json'),getJSON('results.json'),getJSON('stats.json'),getJSON('history.json')]);ROSTER=(rd.players||[]).map(p=>({num:String(p.num),name:p.name,pos:p.pos,class:p.class||'Class not listed'}));SCHEDULE=sd.games||sd;RANKINGS=rank;OPPONENTS=Object.fromEntries((opp.opponents||[]).map(o=>[o.name,o]));RESULTS=res;STATS=stats;HISTORY=hist.questions||[];initLearning();save();render()}catch(e){console.error(e);app.innerHTML='<main class="screen"><section class="more-card"><h3>Irish Player IQ could not load its verified data.</h3><p>Refresh the page and try again.</p></section></main>'}}
boot();
})();
