let roster=[],schedule=[],stats={},history={},opponents={},meta={},current=null,answered=false;
const DEFAULT_STATE={score:0,streak:0,best:0,xp:0,seen:0,mastery:{}};
function readState(){
  try{
    const raw=localStorage.getItem('ipiq6');
    const parsed=raw?JSON.parse(raw):{};
    return Object.assign({},DEFAULT_STATE,parsed,{mastery:Object.assign({},DEFAULT_STATE.mastery,parsed.mastery||{})});
  }catch(e){return Object.assign({},DEFAULT_STATE,{mastery:{}});}
}
let state=readState();
const $=s=>document.querySelector(s), esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])), norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,''), shuffle=a=>[...a].sort(()=>Math.random()-.5);
const save=()=>{try{localStorage.setItem('ipiq6',JSON.stringify(state));}catch(e){/* progress storage unavailable; gameplay still works */}};
async function load(){
  const qs=Date.now();
  const urls=['roster.json','schedule.json','stats.json','history.json','opponents.json'];
  const responses=await Promise.all(urls.map(u=>fetch(`./${u}?${qs}`,{cache:'no-store'})));
  if(responses.some(r=>!r.ok)) throw new Error('Verified data file unavailable');
  const [r,s,t,h,o]=await Promise.all(responses.map(r=>r.json()));
  if(!Array.isArray(r.players)||!Array.isArray(s.games)) throw new Error('Verified data format invalid');
  meta=r; roster=r.players; schedule=s.games; stats=t; history=h; opponents=o;
  state.lastSync=meta.checked_at; save();
}
function top(e,t){return `<div class="goldline"></div><header><div class="brand">IRISH <b>PLAYER IQ</b></div><button class="back" onclick="home()">← MENU</button></header><section class="head"><div class="eyebrow">${e}</div><h1>${t}</h1></section>`}
function home(){
 document.body.innerHTML=`<div class="screen"><div class="goldline"></div><main class="home">
 <div class="eyebrow">NOTRE DAME FOOTBALL • 2026–27</div><div class="sync">● VERIFIED ROSTER • ${esc(state.lastSync||'SYNCING')}</div>
 <h2>IRISH<br><span>PLAYER IQ</span></h2><p class="sub">Master the current Irish roster first. Then learn the team, the season and its history.</p>
 <div class="iq"><div class="iqring"><b>${masteryPct()}%</b><small>PLAYER IQ</small></div><div class="iqstats"><div><b>${masteredCount()}</b><small>PLAYERS MASTERED</small></div><div><b>${state.best}</b><small>BEST STREAK</small></div><div><b>${state.xp}</b><small>XP</small></div></div></div>
 <div class="hero"><button onclick="mixup()"><em>01 • CORE MODE</em><b>IRISH MIX-UP</b><small>Player • number • position • photo</small><strong>PLAY →</strong></button><button onclick="quiz('number')"><em>02 • CORE MODE</em><b>NUMBER → PLAYER</b><small>Build instant number recognition.</small><strong>PLAY →</strong></button></div>
 <div class="grid"><button onclick="quiz('player')">PLAYER → NUMBER <span>→</span></button><button onclick="visualQuiz()">VISUAL IQ <span>→</span></button><button onclick="facts()">PLAYER FACTS <span>→</span></button><button onclick="elite()">ELITE MODE <span>→</span></button></div>
 <div class="season-grid"><button onclick="preseason()"><b>PRESEASON</b><small>Learn the roster & season</small></button><button onclick="pregame()"><b>PRE-GAME</b><small>Scout the next opponent</small></button><button onclick="postgame()"><b>POST-GAME</b><small>Learn what happened</small></button><button onclick="seasonHub()"><b>SEASON</b><small>Live 2026 progress</small></button><button class="wide" onclick="historyMode()"><b>HISTORY</b><small>Verified Notre Dame teams & legends</small></button></div>
 <div class="nextgame">${nextGameCard()}</div><div class="data-note"><b>DATA STANDARD</b><p>Only verified information enters scored questions. If an official source has not published a fact, the app does not display it as a fact.</p><button onclick="updates()">DATA & SYNC STATUS →</button></div>
 </main></div>`;
}
function nextGameCard(){
 const g=schedule.find(x=>new Date(x[0]+'T23:59:00')>=new Date()); if(!g) return `<div class="eyebrow">SEASON STATUS</div><b>NO UPCOMING GAME IN THE VERIFIED SCHEDULE</b>`;
 const opp=opponents[g[1]]; const extra=opp?.verified?`<small>${esc(g[0])} • ${esc(g[3])}${g[4]?` • ${esc(g[4])}`:''}</small>`:`<small>${esc(g[0])} • ${esc(g[3])}</small>`;
 return `<div class="eyebrow">NEXT GAME</div><h3>${esc(g[1])}</h3>${extra}<button onclick="pregame()">GAME PREP →</button>`;
}
function masteryKey(p){return p.name+'|'+p.num}
function mget(p){return state.mastery[masteryKey(p)]||{name:0,num:0,pos:0,visual:0}}
function masteredCount(){return roster.filter(p=>{let m=mget(p);return m.name>=3&&m.num>=3&&m.pos>=3}).length}
function masteryPct(){return roster.length?Math.round(masteredCount()/roster.length*100):0}
function bump(p,field,ok){let m=mget(p);m[field]=Math.max(0,Math.min(10,m[field]+(ok?1:-1)));state.mastery[masteryKey(p)]=m}
function optionsFor(field,p){const target=p[field];let pool=[...new Set(roster.map(x=>x[field]).filter(Boolean))].filter(x=>x!==target);return shuffle([target,...shuffle(pool).slice(0,3)])}
function answerUI(question, choices, onAnswer, sub='CHOOSE YOUR ANSWER'){
 document.body.innerHTML=`<div class="screen">${top('IRISH MIX-UP',question)}<div class="qwrap"><div class="qsub">${sub}</div><div class="answers">${choices.map((x,i)=>`<button class="answer" data-v="${esc(x)}"><b>${String.fromCharCode(65+i)}</b>${esc(x)}</button>`).join('')}</div><div id="res" class="res"></div><button id="next" class="next" hidden>NEXT →</button></div></div>`;
 $('.answers').onclick=e=>{const b=e.target.closest('.answer');if(!b||answered)return;answered=true;const ok=onAnswer(b.dataset.v);document.querySelectorAll('.answer').forEach(x=>{if(norm(x.dataset.v)===norm(onAnswer.correct))x.classList.add('correct');else x.classList.add('dim')});b.classList.remove('dim');b.classList.add(ok?'correct':'wrong');$('#res').className='res show '+(ok?'good':'bad');$('#res').innerHTML=`<b>${ok?'✓ CORRECT':'✕ NOT QUITE'}</b><span>${ok?'Keep building the connection.':`Correct answer: ${esc(onAnswer.correct)}`}</span>`;$('#next').hidden=false;save()};
 $('#next').onclick=()=>mixup();
}
function mixup(){
 current=roster[Math.floor(Math.random()*roster.length)];answered=false;state.seen++;const m=mget(current);
 const modes=['numToName','nameToNum','nameToPos','numToPos']; if(m.visual<3)modes.push('visualLike'); const mode=modes[Math.floor(Math.random()*modes.length)];
 if(mode==='numToName'){onAnswer.correct=current.name;answerUI(`WHO WEARS #${current.num}?`,optionsFor('name',current),v=>{let ok=norm(v)===norm(current.name);bump(current,'name',ok);bump(current,'num',ok);if(ok)reward(10);return ok})}
 else if(mode==='nameToNum'){onAnswer.correct=current.num;answerUI(`WHAT NUMBER DOES ${current.name.toUpperCase()} WEAR?`,optionsFor('num',current),v=>{let ok=v===current.num;bump(current,'num',ok);bump(current,'name',ok);if(ok)reward(10);return ok})}
 else if(mode==='nameToPos'){onAnswer.correct=current.pos;answerUI(`${current.name.toUpperCase()} — WHAT POSITION?`,optionsFor('pos',current),v=>{let ok=v===current.pos;bump(current,'pos',ok);if(ok)reward(10);return ok})}
 else if(mode==='numToPos'){onAnswer.correct=current.pos;answerUI(`#${current.num} — WHAT POSITION?`,optionsFor('pos',current),v=>{let ok=v===current.pos;bump(current,'pos',ok);if(ok)reward(10);return ok})}
 else {visualQuiz()}
}
function reward(x){state.score++;state.streak++;state.best=Math.max(state.best,state.streak);state.xp+=x}
function quiz(type){current=roster[Math.floor(Math.random()*roster.length)];answered=false;let ask=type==='player';onAnswer.correct=ask?current.num:current.name;answerUI(ask?`${current.name.toUpperCase()} — WHAT NUMBER?`:`WHO WEARS #${current.num}?`,ask?optionsFor('num',current):optionsFor('name',current),v=>{let ok=norm(v)===norm(onAnswer.correct);bump(current,ask?'num':'name',ok);if(ok)reward(10);else state.streak=0;return ok},'CORE PLAYER LEARNING')}
function visualQuiz(){document.body.innerHTML=`<div class="screen">${top('VISUAL IQ','VERIFIED PHOTO MODE')}<div class="locked"><div class="lock">◉</div><h2>PHOTO VERIFICATION IN PROGRESS</h2><p>Visual scored questions are intentionally locked until a real Notre Dame player image has been verified for identity, uniform context and exposed jersey number.</p><p><b>No substitute image is used.</b></p><button class="next" onclick="photoLab()">PHOTO RADAR →</button></div></div>`}
function elite(){current=roster[Math.floor(Math.random()*roster.length)];answered=false;document.body.innerHTML=`<div class="screen">${top('ELITE MODE','HIDDEN NUMBER')}<div class="locked"><div class="lock">▣</div><h2>PHOTO VERIFICATION GATE</h2><p>Elite scored questions activate only when a verified Notre Dame photo shows the correct player and the jersey number can be independently verified.</p><p><b>Current status:</b> no unverified image will be used.</p><button class="next" onclick="photoLab()">PHOTO RADAR →</button></div></div>`}
function facts(){const p=roster[Math.floor(Math.random()*roster.length)];document.body.innerHTML=`<div class="screen">${top('PLAYER IQ','PLAYER CARD')}<div class="player-card"><div class="num-small">#${p.num}</div><h2>${esc(p.name)}</h2><div class="pos">${esc(p.pos)}</div><div class="verified">✓ VERIFIED CORE DATA</div><div class="facts"><div><small>NUMBER</small><b>#${esc(p.num)}</b></div><div><small>POSITION</small><b>${esc(p.pos)}</b></div></div></div><div class="notice"><b>MORE FACTS ARE NOT SHOWN YET</b><p>The app will add biographical and statistical facts only when they are verified from an authoritative source.</p></div><button class="next" onclick="facts()">NEXT PLAYER →</button></div>`}
function preseason(){document.body.innerHTML=`<div class="screen">${top('PRESEASON','MEET THE 2026 IRISH')}<div class="mission"><b>MISSION</b><h2>MASTER THE ROSTER</h2><p>Start with name, number, position and visual recognition. The season preview is layered on top of that foundation.</p><div class="meter"><span style="width:${masteryPct()}%"></span></div><small>${masteredCount()} of ${roster.length} players fully mastered</small></div><div class="season-grid"><button onclick="mixup()"><b>ROSTER MIX-UP</b><small>Randomized player learning</small></button><button onclick="facts()"><b>PLAYER FACTS</b><small>Verified data only</small></button></div><div class="notice"><b>2026 SEASON</b><p>The official schedule is loaded separately and updates through the data pipeline. No projections are scored as facts.</p></div></div>`}
function pregame(){const g=schedule.find(x=>new Date(x[0]+'T23:59:00')>=new Date());if(!g){return simple('PRE-GAME','NO UPCOMING GAME','The verified schedule currently has no upcoming game.');}const o=opponents[g[1]];document.body.innerHTML=`<div class="screen">${top('PRE-GAME','SCOUT THE MATCHUP')}<div class="match"><div class="eyebrow">NEXT OPPONENT</div><h2>${esc(g[1])}</h2><p>${esc(g[0])} • ${esc(g[3])}${g[4]?` • ${esc(g[4])}`:''}</p>${o?.verified?`<div class="verified">✓ OFFICIAL MATCHUP DATA</div><div class="facts"><div><small>LAST MEETING</small><b>${esc(o.last_meeting_result)}</b></div><div><small>LAST MEETING</small><b>${esc(o.last_meeting_site)}</b></div></div>`:''}</div><button class="next" onclick="mixup()">IRISH PLAYER WARM-UP →</button><button class="next alt" onclick="seasonHub()">VIEW SEASON →</button></div>`}
function postgame(){const games=stats.games||[];if(!games.length)return simple('POST-GAME','NO GAME DATA YET','There are no completed 2026 games in the verified statistics feed as of the last sync. The first scheduled game is Sept. 6.');const g=games[games.length-1];document.body.innerHTML=`<div class="screen">${top('POST-GAME','BREAK DOWN THE GAME')}<div class="match"><div class="eyebrow">VERIFIED RESULT</div><h2>${esc(g.opponent||'Notre Dame')}</h2><p>${esc(g.result||'')}</p><div class="facts">${Object.entries(g.team_stats||{}).slice(0,6).map(([k,v])=>`<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div></div><button class="next" onclick="mixup()">PLAYER PERFORMANCE QUIZ →</button></div>`}
function seasonHub(){const games=stats.games||[];const next=schedule.find(x=>new Date(x[0]+'T23:59:00')>=new Date());document.body.innerHTML=`<div class="screen">${top('SEASON','2026 IRISH SEASON')}<div class="season-hero"><div class="eyebrow">CURRENT VERIFIED DATA</div><h2>${games.length?`${games.length} GAME${games.length>1?'S':''} COMPLETE`:'PRESEASON'}</h2><p>${games.length?'Season data is current through the latest verified game feed.':'No completed 2026 games are in the official stats feed yet.'}</p></div><div class="season-grid"><button onclick="scheduleView()"><b>SEASON MAP</b><small>Official schedule</small></button><button onclick="postgame()"><b>POST-GAME</b><small>Completed games only</small></button><button onclick="statsView()"><b>STATS</b><small>Verified stats only</small></button><button onclick="pregame()"><b>NEXT GAME</b><small>${next?esc(next[1]):'No upcoming game'}</small></button></div><div class="notice"><b>POSTSEASON RULE</b><p>Playoff games are added only after Notre Dame officially qualifies and an official matchup is published.</p></div></div>`}
function statsView(){const players=Object.entries(stats.player_stats||{});document.body.innerHTML=`<div class="screen">${top('SEASON DATA','VERIFIED STATISTICS')}<div class="status"><b>✓ OFFICIAL DATA POLICY</b><p>${esc(stats.source_policy||'Official Notre Dame sources only')}</p><p>Last sync: ${esc(stats.last_sync||'')}</p></div>${players.length?`<div class="list">${players.slice(0,20).map(([n,s])=>`<article><h3>${esc(n)}</h3><p>${Object.entries(s).map(([k,v])=>`${esc(k)}: ${esc(v)}`).join(' • ')}</p></article>`).join('')}</div>`:`<div class="notice"><b>NO 2026 PLAYER STATS YET</b><p>No completed 2026 game has been published into the verified stats feed.</p></div>`}</div>`}
function scheduleView(){document.body.innerHTML=`<div class="screen">${top('2026 SEASON','OFFICIAL SCHEDULE')}<div class="schedule">${schedule.map((g,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><b>${esc(g[1])}</b><small>${esc(g[0])} • ${esc(g[2])} • ${esc(g[3])}${g[4]?` • ${esc(g[4])}`:''}</small></div></article>`).join('')}</div></div>`}
function historyMode(){document.body.innerHTML=`<div class="screen">${top('HISTORY','KNOW THE IRISH')}<div class="notice"><b>VERIFIED HISTORICAL DATABASE</b><p>Historical cards use Notre Dame official archives and historical features. The database expands only when a season is verified.</p></div><div class="list">${(history.verified_seasons||[]).map(x=>`<article><i>${esc(x.season)}</i><h3>${esc(x.record)} • ${esc(x.coach)}</h3><p>${x.national_champion?'National Champion — verified by Notre Dame historical source.':''}</p><a href="${esc(x.source)}" target="_blank">SOURCE →</a></article>`).join('')}</div></div>`}
function photoLab(){document.body.innerHTML=`<div class="screen">${top('PHOTO RADAR','VERIFIED VISUALS')}<div class="notice"><b>STRICT PHOTO GATE</b><p>Photos become scored only after player identity, Notre Dame context and exposed number are independently verified. Candidate sources never become quiz answers automatically.</p></div></div>`}
function updates(){document.body.innerHTML=`<div class="screen">${top('DATA CENTER','VERIFICATION & SYNC')}<div class="status"><b>✓ VERIFIED ROSTER</b><h2>${roster.length} players</h2><p>Source: official Notre Dame 2026-27 roster.<br>Checked: ${esc(meta.checked_at)}</p></div><div class="status"><b>LIVE STAT PIPELINE</b><p>After each game, the sync job checks official Notre Dame schedule, postgame and statistical sources. New verified results are written to the data files and the hosted app loads them on the next open.</p><p><b>Policy:</b> no projections, guesses or unverified stats are inserted.</p></div><div class="status"><b>SYNC CADENCE</b><p>Hourly automated check in the deployment workflow, plus refresh-on-open in the app.</p></div></div>`}
function simple(a,b,c){document.body.innerHTML=`<div class="screen">${top(a,b)}<div class="locked"><h2>${esc(b)}</h2><p>${esc(c)}</p><button class="next" onclick="home()">BACK TO PLAYER IQ</button></div></div>`}
(async()=>{
  try{
    await load();
    home();
  }catch(e){
    console.error(e);
    state.lastSync='DATA UNAVAILABLE';
    document.body.innerHTML=`<div class="screen"><div class="goldline"></div><main class="home">
      <div class="eyebrow">NOTRE DAME FOOTBALL • 2026–27</div>
      <h2>IRISH<br><span>PLAYER IQ</span></h2>
      <div class="notice"><b>VERIFIED DATA IS CURRENTLY UNAVAILABLE</b>
      <p>The app will not substitute, infer, or display unverified roster or statistics. Refresh after GitHub Pages finishes deploying.</p>
      <button class="next" onclick="location.reload()">REFRESH APP →</button></div>
      </main></div>`;
  }
})();
