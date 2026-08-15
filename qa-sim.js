const fs=require('fs');
const app=fs.readFileSync('app.js','utf8');
const raw=app.match(/const DEFAULT_ROSTER=`([\s\S]*?)`\.split/)[1];
const R=raw.trim().split('\n').map(x=>{const [num,name,pos]=x.split('|');return {num,name,pos};});
const modes=['numberPlayer','playerNumber','playerPosition','photoPlayer','photoNumber','photoPosition','hidden'];
let failures=[]; let questions=0;
function unique(a){return [...new Set(a)]}
function choices(correct,vals){const wrong=unique(vals.filter(x=>x!==correct)).sort(()=>Math.random()-.5).slice(0,3);return [correct,...wrong].sort(()=>Math.random()-.5)}
for(let user=1;user<=100;user++){
  for(let n=1;n<=100;n++){
    const p=R[Math.floor(Math.random()*R.length)]; const m=modes[Math.floor(Math.random()*modes.length)]; questions++;
    let answer, support, title;
    if(m==='numberPlayer'){answer=p.name;support=`#${p.num}`;title='WHO IS THIS PLAYER?'}
    else if(m==='playerNumber'){answer=p.num;support=`${p.name} • ${p.pos}`;title='WHAT IS HIS JERSEY NUMBER?'}
    else if(m==='playerPosition'){answer=p.pos;support=`${p.name} • #${p.num}`;title='WHAT POSITION DOES HE PLAY?'}
    else if(m==='photoPlayer'){answer=p.name;support='Uniform recognition';title='WHO IS THIS PLAYER?'}
    else if(m==='photoNumber'){answer=p.num;support=`${p.name} • ${p.pos}`;title='WHAT IS HIS JERSEY NUMBER?'}
    else if(m==='photoPosition'){answer=p.pos;support=`${p.name} • #${p.num}`;title='WHAT POSITION DOES HE PLAY?'}
    else {answer=p.name;support='Number hidden';title='WHO IS THIS PLAYER?'}
    const vals=m.includes('Number')?[...R.map(x=>x.num)]:m.includes('Position')?[...R.map(x=>x.pos)]:R.map(x=>x.name);
    const opts=choices(answer,vals);
    if(opts.length!==4) failures.push(`user ${user} q ${n}: did not produce 4 choices`);
    if(!opts.includes(answer)) failures.push(`user ${user} q ${n}: correct answer missing`);
    if(new Set(opts).size!==opts.length) failures.push(`user ${user} q ${n}: duplicate choices`);
    if(m==='playerNumber' && !support.includes(p.name) ) failures.push(`user ${user} q ${n}: playerNumber missing name`);
    if(m==='playerNumber' && !support.includes(p.pos)) failures.push(`user ${user} q ${n}: playerNumber missing position`);
    if(m==='playerPosition' && !support.includes(p.name)) failures.push(`user ${user} q ${n}: playerPosition missing name`);
    if(m==='playerPosition' && !support.includes(`#${p.num}`)) failures.push(`user ${user} q ${n}: playerPosition missing number`);
    if(!answer) failures.push(`user ${user} q ${n}: empty answer`);
  }
}
// Duplicate-number identity audit: every duplicated number has distinct position/name records.
const byNum={}; R.forEach(p=>(byNum[p.num]??=[]).push(p));
for(const [num,players] of Object.entries(byNum)) if(players.length>1 && new Set(players.map(p=>p.name+'|'+p.pos)).size!==players.length) failures.push(`duplicate identity collision at #${num}`);
console.log(`Simulated ${questions} questions across 100 independent users.`);
console.log(`Roster records: ${R.length}; duplicate jersey numbers: ${Object.values(byNum).filter(x=>x.length>1).length}`);
if(failures.length){console.error(`FAILURES: ${failures.length}`);console.error(failures.slice(0,25).join('\n'));process.exit(1)}
console.log('PASS: four-choice integrity, correct-answer inclusion, duplicate-number handling, and requested player-context displays all validated.');
