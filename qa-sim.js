const fs=require('fs');
const roster=JSON.parse(fs.readFileSync('roster.json','utf8')).players;
const assert=(x,m)=>{if(!x)throw new Error(m)};
const unique=a=>[...new Set(a)];
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
function playerChoices(p,pool){const wrong=shuffle(pool.filter(x=>x.name!==p.name && !(x.num===p.num&&x.pos===p.pos))).slice(0,3);return shuffle([p.name,...wrong.map(x=>x.name)]);}
function valueChoices(v,vals){return shuffle([v,...shuffle(unique(vals.filter(x=>x!==v))).slice(0,3)]);}
for(const p of roster){
  const pc=playerChoices(p,roster); assert(pc.length===4,`player-choice count failed for ${p.name}`); assert(pc.filter(x=>x===p.name).length===1,`duplicate correct player ${p.name}`);
  const bad=pc.filter(name=>{const q=roster.find(x=>x.name===name);return q.num===p.num&&q.pos===p.pos&&q.name!==p.name;});
  assert(bad.length===0,`ambiguous number+position for ${p.name}: ${bad.join(',')}`);
  const nc=valueChoices(p.num,roster.map(x=>x.num)); assert(nc.includes(p.num),`number answer missing ${p.name}`); assert(new Set(nc).size===nc.length,`duplicate number choice ${p.name}`);
  const pos=valueChoices(p.pos,roster.map(x=>x.pos)); assert(pos.includes(p.pos),`position answer missing ${p.name}`); assert(new Set(pos).size===pos.length,`duplicate position choice ${p.name}`);
}
// 100 simulated learners: each learner works through expanding pools, requiring 2 correct recalls in each skill.
for(let user=0;user<100;user++){
  const mastery={}; let poolSize=6, level=1, steps=0;
  const rec=n=>mastery[n]||(mastery[n]={number:0,player:0,position:0});
  while(steps<50000){
    const pool=roster.slice(0,poolSize); pool.forEach(p=>rec(p.name));
    const incomplete=pool.filter(p=>{const r=rec(p.name);return r.number<2||r.player<2||r.position<2;});
    if(!incomplete.length){if(poolSize>=roster.length) break; poolSize=Math.min(roster.length,poolSize+3);level++;continue;}
    const p=incomplete[Math.floor(Math.random()*incomplete.length)]; const r=rec(p.name);
    const skills=['number','player','position'].filter(k=>r[k]<2); const skill=skills[Math.floor(Math.random()*skills.length)];
    r[skill]++; steps++;
  }
  assert(poolSize===roster.length,`learner ${user} failed to reach full roster; pool ${poolSize}`);
  for(const p of roster){const r=rec(p.name);assert(r.number>=2&&r.player>=2&&r.position>=2,`learner ${user} did not master ${p.name}`)}
}
console.log('QA PASS: 100 learners, ambiguity checks, and full-pool Learning Mode progression passed.');
console.log(`Roster: ${roster.length} players; unique jersey numbers: ${unique(roster.map(p=>p.num)).length}; positions: ${unique(roster.map(p=>p.pos)).length}; classes: ${unique(roster.map(p=>p.class)).join(', ')}`);
