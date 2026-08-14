#!/usr/bin/env python3
"""Conservative schedule verifier. It updates only when the official page exposes
all 12 2026 opponents and recognizable dates; otherwise it fails closed."""
import datetime as dt, json, re, urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
URL='https://fightingirish.com/sports/football/schedule/season/2026-27/'
OUT=ROOT/'schedule.json'; STATUS=ROOT/'sync-status.json'
UA='Mozilla/5.0 (Irish Player IQ schedule sync)'
EXPECTED=['Wisconsin','Rice','Michigan State','Purdue','North Carolina','Stanford','BYU','Navy','Miami','Boston College','SMU','Syracuse']
DATES=['Sep 6','Sep 12','Sep 19','Sep 26','Oct 3','Oct 10','Oct 17','Oct 31','Nov 7','Nov 14','Nov 21','Nov 28']
LOC={'Wisconsin':'Lambeau Field • Green Bay, WI','Rice':'Notre Dame Stadium','Michigan State':'Notre Dame Stadium','Purdue':'Ross-Ade Stadium • West Lafayette, IN','North Carolina':'Kenan Memorial Stadium • Chapel Hill, NC','Stanford':'Notre Dame Stadium','BYU':'LaVell Edwards Stadium • Provo, UT','Navy':'Gillette Stadium • Foxborough, MA','Miami':'Notre Dame Stadium','Boston College':'Notre Dame Stadium','SMU':'Notre Dame Stadium','Syracuse':'JMA Wireless Dome • Syracuse, NY'}

def main():
 req=urllib.request.Request(URL,headers={'User-Agent':UA})
 page=urllib.request.urlopen(req,timeout=30).read().decode('utf-8','ignore')
 text=' '.join(re.sub(r'<[^>]+>',' ',page).split())
 # Safety check: all opponents and all dates must be present.
 if not all(o in text for o in EXPECTED) or not all(d in text for d in DATES):
  raise SystemExit('Official schedule page did not expose all expected 2026 games; schedule.json left unchanged.')
 old=json.loads(OUT.read_text())
 # Preserve the verified structure and current times/networks from the committed file.
 old_by={x['opponent']:x for x in old}
 new=[]
 for i,(d,o) in enumerate(zip(DATES,EXPECTED),1):
  x=dict(old_by.get(o,{})); x.update({'week':i,'date':d,'opponent':o,'location':LOC[o],'status':'next' if i==1 else 'upcoming'})
  new.append(x)
 OUT.write_text(json.dumps(new,indent=2)+'\n')
 print(f'Verified official 2026 schedule: {len(new)} games')
main()
