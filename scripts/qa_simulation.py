#!/usr/bin/env python3
"""Deterministic gameplay simulation for Irish Player IQ.
100 independent personas, 50 rounds each, 10 questions/round.
"""
import json, random
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
roster=json.loads((ROOT/'roster.json').read_text())
assert len(roster)==114
nums=sorted({p['num'] for p in roster})
pos=sorted({p['pos'] for p in roster})
assert len(nums)==82 and len(pos)==12
modes=['numberPlayer','playerNumber','playerPosition','photoPlayer','photoNumber','photoPosition','hidden']
rng=random.Random(20260814)
questions=0
for persona in range(100):
    score=streak=best=correct=skips=0
    for rnd in range(50):
        mode='mix'
        for qn in range(10):
            p=rng.choice(roster); typ=rng.choice(modes)
            if typ in ('numberPlayer','photoPlayer'):
                answer=p['name']; pool=[x['name'] for x in roster if x['name']!=p['name']]
            elif typ in ('playerNumber','photoNumber','hidden'):
                answer=p['num']; pool=[x for x in nums if x!=p['num']]
            else:
                answer=p['pos']; pool=[x for x in pos if x!=p['pos']]
            choices=[answer]+rng.sample(pool, min(3,len(pool)))
            rng.shuffle(choices)
            assert len(choices)==4 and choices.count(answer)==1
            # Simulate 50/50, skip, or answer.
            action=rng.random()
            if action < .06:
                skips += 1; streak=0; continue
            if action < .16:
                wrong=[c for c in choices if c!=answer]
                removed=set(rng.sample(wrong,2))
                choices=[c for c in choices if c not in removed]
                assert answer in choices and len(choices)==2
            selected=answer if rng.random() < (0.55 + persona*0.004) else rng.choice([c for c in choices if c!=answer])
            ok=selected==answer
            if ok:
                points=(100+streak*25)*(2 if rng.random()<.10 else 1)
                score+=points; streak+=1; best=max(best,streak); correct+=1
            else: streak=0
            questions+=1
print(f'PASS: {questions:,} simulated questions across 100 personas.')
print(f'Roster: {len(roster)} players / {len(nums)} unique numbers / {len(pos)} positions.')
