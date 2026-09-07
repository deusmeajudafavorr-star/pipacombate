import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const COLORS = ['#ff4d6d','#4dabf7','#ffd43b','#69db7c','#da77f2','#ff922b','#20c997','#74c0fc'];
const BOT_NAMES = ['ReiDoCerol','PipaMaster','MestreDaLinha','CortaTudo','PipaInsana','VentoForte'];

function App() {
  const [players, setPlayers] = useState(() => BOT_NAMES.map((name, i) => ({ id: crypto.randomUUID(), name: `@${name}`, points: (BOT_NAMES.length-i)*10, color: COLORS[i], x: 10 + Math.random()*75, y: 10 + Math.random()*55, vx: (Math.random()-.5)*.25, vy: (Math.random()-.5)*.18, alive: true, wins: 0 })));
  const [events, setEvents] = useState(['🔴 Arena iniciada','🪁 Bots entraram na disputa']);
  const [nick, setNick] = useState('');
  const arenaRef = useRef(null);

  const alivePlayers = useMemo(() => players.filter(p => p.alive), [players]);
  const ranking = [...players].sort((a,b) => b.points-a.points).slice(0,5);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlayers(prev => {
        const next = prev.map(p => ({...p, x: Math.max(4, Math.min(88, p.x+p.vx)), y: Math.max(4, Math.min(68, p.y+p.vy))}));
        const living = next.filter(p => p.alive);
        if (living.length >= 2 && Math.random() < 0.08) {
          const a = living[Math.floor(Math.random()*living.length)];
          let b = living[Math.floor(Math.random()*living.length)];
          while (b.id === a.id) b = living[Math.floor(Math.random()*living.length)];
          const winner = Math.random() < 0.5 ? a : b;
          const loser = winner.id === a.id ? b : a;
          setEvents(e => [`✂️ ${winner.name} venceu ${loser.name}`, `🔥 ${winner.name} ganhou +10 pontos`, ...e].slice(0,8));
          return next.map(p => p.id === winner.id ? {...p, points:p.points+10, wins:p.wins+1, vx:p.vx*1.03, vy:p.vy*1.03} : p.id === loser.id ? {...p, alive:false} : p);
        }
        return next;
      });
    }, 160);
    return () => clearInterval(timer);
  }, []);

  const enter = () => {
    const name = nick.trim().replace(/^@+/, '');
    if (!name) return;
    const player = { id: crypto.randomUUID(), name:`@${name.slice(0,18)}`, points:0, color:COLORS[Math.floor(Math.random()*COLORS.length)], x:3, y:58, vx:.34, vy:-.12, alive:true, wins:0 };
    setPlayers(p => [...p.filter(x => x.alive || x.points > 0), player]);
    setEvents(e => [`🪁 @${name.slice(0,18)} entrou na arena!`, ...e].slice(0,8));
    setNick('');
  };

  return <main className="page">
    <section className="phone">
      <header className="topbar">
        <div><div className="title">🪁 PIPA COMBATE</div><div className="live"><span/> AO VIVO · {alivePlayers.length} pipas</div></div>
        <div className="season">TEMPORADA 1</div>
      </header>

      <div className="arena" ref={arenaRef}>
        <div className="sun"/><div className="cloud c1"/><div className="cloud c2"/><div className="cloud c3"/>
        {alivePlayers.map(p => <div key={p.id} className="kite" style={{left:`${p.x}%`, top:`${p.y}%`, '--kite':p.color}}>
          <div className="name">{p.name}</div><div className="kiteShape"><span/></div><div className="tail">╲╱╲╱╲</div>
        </div>)}
        <div className="battlePulse">⚡ BATALHAS AUTOMÁTICAS</div>
      </div>

      <div className="bottom">
        <div className="ranking">
          <div className="rankTitle">🏆 RANKING AO VIVO</div>
          {ranking.map((p,i)=><div className="rankRow" key={p.id}><b>{i+1}</b><span className="rankName">{i===0?'👑 ':''}{p.name}</span><strong>{p.points}</strong></div>)}
        </div>
        <div className="feed"><div className="feedTitle">EVENTOS</div>{events.slice(0,5).map((e,i)=><div key={`${e}-${i}`}>{e}</div>)}</div>
        <div className="join"><input value={nick} onChange={e=>setNick(e.target.value)} onKeyDown={e=>e.key==='Enter'&&enter()} placeholder="Digite seu nickname" maxLength={18}/><button onClick={enter}>🪁 ENTRAR NA BATALHA</button></div>
      </div>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />);
