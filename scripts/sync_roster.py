#!/usr/bin/env python3
"""Safely sync the Notre Dame 2026-27 roster from the official athletics page.
Fails closed: it will not overwrite roster.json unless a plausible roster is parsed.
"""
import json, re, sys
from pathlib import Path
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup

URL='https://fightingirish.com/sports/football/roster/season/2026-27/'
OUT=Path('roster.json')

def fetch():
    req=Request(URL,headers={'User-Agent':'Irish-Player-IQ roster verifier'})
    return urlopen(req,timeout=30).read()

def parse(html):
    soup=BeautifulSoup(html,'html.parser')
    players=[]
    for tr in soup.find_all('tr'):
        cells=[c.get_text(' ',strip=True) for c in tr.find_all(['td','th'])]
        if len(cells)<3: continue
        num=cells[0].strip(); name=cells[1].strip(); pos=cells[2].strip().upper()
        if not re.fullmatch(r'\d{1,2}',num): continue
        if not name or pos not in {'QB','RB','WR','TE','OL','DL','LB','CB','S','K','P','LS'}: continue
        players.append({'num':num,'name':name,'pos':pos})
    # de-duplicate exact rows only; duplicate numbers are intentional.
    seen=set(); out=[]
    for p in players:
        k=(p['num'],p['name'],p['pos'])
        if k not in seen: seen.add(k); out.append(p)
    return out

def main():
    players=parse(fetch())
    if len(players)<100:
        raise SystemExit(f'FAIL CLOSED: parsed only {len(players)} players')
    nums=len({p['num'] for p in players}); poss=len({p['pos'] for p in players})
    if nums<60 or poss<8:
        raise SystemExit('FAIL CLOSED: roster shape looks invalid')
    payload={'season':'2026-27','source':URL,'verified_records':len(players),'players':players}
    OUT.write_text(json.dumps(payload,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(f'Updated roster.json: {len(players)} players, {nums} unique numbers, {poss} positions')

if __name__=='__main__': main()
