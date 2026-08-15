#!/usr/bin/env python3
import json
from pathlib import Path
r=json.loads(Path('roster.json').read_text())
assert len(r['players']) >= 100
assert len({p['num'] for p in r['players']}) >= 60
assert len({p['pos'] for p in r['players']}) >= 8
for p in r['players']:
    assert all(k in p and p[k] for k in ('num','name','pos','class'))
s=json.loads(Path('schedule.json').read_text())
assert len(s['games']) >= 12
print('DATA PASS',len(r['players']),'roster players;',len(s['games']),'scheduled games')
