import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  KiteState,
  BattleState,
  ArenaEvent,
  FeedItem,
  TikTokHeart,
  GameStats,
  KiteShape,
  KitePattern,
  LineType,
} from './types';

import { ArenaCanvas } from './components/ArenaCanvas';
import { BattleBannerOverlay } from './components/BattleBannerOverlay';
import { RankingPanel } from './components/RankingPanel';
import { EventFeed } from './components/EventFeed';
import { BottomInputBar } from './components/BottomInputBar';
import { TikTokHearts } from './components/TikTokHearts';
import { KiteCustomizerModal } from './components/KiteCustomizerModal';

import { soundFX } from './utils/sound';
import {
  getRandomBotNickname,
  getRandomColorPair,
  SPECTATOR_COMMENTS,
} from './utils/names';

export default function App() {
  // Sound Mute State
  const [muted, setMuted] = useState(false);

  // Game Stats
  const [stats, setStats] = useState<GameStats>({
    viewersCount: 1420,
    totalBattles: 48,
    seasonName: 'Temporada 1 - Desafio Cerol',
    seasonTimeRemaining: '12d 04h',
    likeCount: 24500,
  });

  // User State
  const [userNickname, setUserNickname] = useState('');
  const [userKiteId, setUserKiteId] = useState<string | null>(null);
  const [userKiteCut, setUserKiteCut] = useState(false);
  const [userCustoms, setUserCustoms] = useState<{
    shape: KiteShape;
    primaryColor: string;
    secondaryColor: string;
    pattern: KitePattern;
    lineType: LineType;
  }>({
    shape: 'diamante',
    primaryColor: '#ef4444',
    secondaryColor: '#fef08a',
    pattern: 'brasil',
    lineType: 'chileana',
  });

  // Customizer Modal
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Kites List
  const [kites, setKites] = useState<KiteState[]>([]);

  // Battles
  const [currentBattle, setCurrentBattle] = useState<BattleState | null>(null);
  const [victoryAnnouncement, setVictoryAnnouncement] = useState<{
    winnerName: string;
    loserName: string;
    combo: number;
    score: number;
  } | null>(null);

  // Live Feed
  const [feed, setFeed] = useState<FeedItem[]>([]);

  // Ranking Alert
  const [newLeaderAlert, setNewLeaderAlert] = useState<string | null>(null);
  const currentLeaderIdRef = useRef<string | null>(null);

  // Random Arena Event
  const [currentEvent, setCurrentEvent] = useState<ArenaEvent | null>(null);
  const [windSpeed, setWindSpeed] = useState(1.0);

  // TikTok Hearts
  const [hearts, setHearts] = useState<TikTokHeart[]>([]);

  // Ref to access kites inside interval loops without stale closures
  const kitesRef = useRef<KiteState[]>([]);
  kitesRef.current = kites;

  const battleInProgressRef = useRef(false);

  // Helper to add feed log
  const addFeedItem = useCallback((item: Omit<FeedItem, 'id' | 'timestamp'>) => {
    const newItem: FeedItem = {
      ...item,
      id: Math.random().toString(),
      timestamp: Date.now(),
    };
    setFeed((prev) => [...prev.slice(-30), newItem]);
  }, []);

  // Initialize Bots in Arena on Mount
  useEffect(() => {
    const initialKites: KiteState[] = [];
    const usedNames: string[] = [];

    const shapes: KiteShape[] = ['diamante', 'raia', 'peixinho', 'brit', 'pipao'];
    const patterns: KitePattern[] = ['brasil', 'flames', 'cyber', 'cerol', 'stripes', 'cross', 'neon'];
    const lineTypes: LineType[] = ['linha10', 'chileana', 'cerol_extra'];

    for (let i = 0; i < 9; i++) {
      const name = getRandomBotNickname(usedNames);
      usedNames.push(name);
      const color = getRandomColorPair();
      const x = 10 + Math.random() * 80;
      const y = 15 + Math.random() * 55;

      const tailNodes = Array.from({ length: 8 }, (_, idx) => ({
        x: (x / 100) * 450,
        y: (y / 100) * 800 + idx * 12,
      }));

      initialKites.push({
        id: `bot_${i}_${Date.now()}`,
        nickname: name,
        isUser: false,
        isBot: true,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        primaryColor: color.primary,
        secondaryColor: color.secondary,
        pattern: patterns[Math.floor(Math.random() * patterns.length)],
        lineType: lineTypes[Math.floor(Math.random() * lineTypes.length)],
        x,
        y,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        angle: (Math.random() - 0.5) * 15,
        targetX: 10 + Math.random() * 80,
        targetY: 15 + Math.random() * 55,
        score: Math.floor(Math.random() * 6) * 10,
        wins: Math.floor(Math.random() * 3),
        combo: 1,
        status: 'flying',
        tailNodes,
        entryProgress: 1,
        fallProgress: 0,
        fallAngle: 0,
        lastBattleTime: 0,
        crown: false,
      });
    }

    setKites(initialKites);

    addFeedItem({
      type: 'event',
      nickname: 'SISTEMA',
      message: 'Transmissão AO VIVO iniciada! Arena lotada!',
      icon: '🔴',
    });
    addFeedItem({
      type: 'comment',
      nickname: 'Espectador_99',
      message: 'Manda buscar que a batalha começou! 🔥',
      icon: '💬',
    });
  }, [addFeedItem]);

  // Main Physics Simulation Loop (60 FPS tick)
  useEffect(() => {
    const interval = setInterval(() => {
      setKites((prevKites) => {
        return prevKites.map((kite) => {
          if (kite.status === 'falling') {
            const nextFallProgress = kite.fallProgress + 0.02;
            if (nextFallProgress >= 1) return null;
            return {
              ...kite,
              y: kite.y + 1.2,
              x: kite.x + Math.sin(nextFallProgress * 10) * 0.8,
              fallProgress: nextFallProgress,
              fallAngle: kite.fallAngle + 0.15,
            };
          }

          if (kite.status === 'entering') {
            const nextProgress = kite.entryProgress + 0.05;
            if (nextProgress >= 1) {
              return { ...kite, entryProgress: 1, status: 'flying' };
            }
            return {
              ...kite,
              entryProgress: nextProgress,
              y: 100 - nextProgress * (100 - kite.targetY),
            };
          }

          let targetX = kite.targetX;
          let targetY = kite.targetY;

          if (Math.random() < 0.02) {
            targetX = 10 + Math.random() * 80;
            targetY = 15 + Math.random() * 55;
          }

          const dx = targetX - kite.x;
          const dy = targetY - kite.y;
          const vx = kite.vx * 0.95 + dx * 0.005 * windSpeed;
          const vy = kite.vy * 0.95 + dy * 0.005 * windSpeed;
          const nextX = Math.max(8, Math.min(92, kite.x + vx));
          const nextY = Math.max(12, Math.min(68, kite.y + vy));
          const targetAngle = vx * 25;
          const angle = kite.angle + (targetAngle - kite.angle) * 0.1;

          const pixelX = (nextX / 100) * 450;
          const pixelY = (nextY / 100) * 800;
          const newNodes = [...(kite.tailNodes || [])];

          if (newNodes.length > 0) {
            newNodes[0] = { x: pixelX, y: pixelY + 25 };
            for (let i = 1; i < newNodes.length; i++) {
              const prev = newNodes[i - 1];
              const curr = newNodes[i];
              const ndx = prev.x - curr.x;
              const ndy = prev.y - curr.y + 3 * windSpeed;
              newNodes[i] = {
                x: curr.x + ndx * 0.35 + Math.sin(Date.now() * 0.005 + i) * 1.5 * windSpeed,
                y: curr.y + ndy * 0.35,
              };
            }
          }

          return {
            ...kite,
            x: nextX,
            y: nextY,
            vx,
            vy,
            angle,
            targetX,
            targetY,
            tailNodes: newNodes,
          };
        }).filter(Boolean) as KiteState[];
      });
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, [windSpeed]);

  // Keep arena populated with bots if count drops below 7
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCount = kitesRef.current.filter((k) => k.status === 'flying').length;
      if (currentCount < 8) {
        const existingNames = kitesRef.current.map((k) => k.nickname);
        const name = getRandomBotNickname(existingNames);
        const color = getRandomColorPair();
        const x = 10 + Math.random() * 80;
        const targetY = 15 + Math.random() * 50;

        const newBot: KiteState = {
          id: `bot_spawn_${Date.now()}`,
          nickname: name,
          isUser: false,
          isBot: true,
          shape: 'diamante',
          primaryColor: color.primary,
          secondaryColor: color.secondary,
          pattern: 'brasil',
          lineType: 'linha10',
          x,
          y: 95,
          vx: 0,
          vy: -0.5,
          angle: 0,
          targetX: x,
          targetY,
          score: 0,
          wins: 0,
          combo: 1,
          status: 'entering',
          tailNodes: Array.from({ length: 8 }, (_, idx) => ({
            x: (x / 100) * 450,
            y: 800 + idx * 12,
          })),
          entryProgress: 0,
          fallProgress: 0,
          fallAngle: 0,
          lastBattleTime: Date.now(),
          crown: false,
        };

        setKites((prev) => [...prev, newBot]);
        addFeedItem({ type: 'join', nickname: name, message: 'entrou voando na arena!', icon: '🔥' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [addFeedItem]);

  // Simulated Audience Comments in Feed
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        const commentTemplate = SPECTATOR_COMMENTS[Math.floor(Math.random() * SPECTATOR_COMMENTS.length)];
        const activeKites = kitesRef.current.filter((k) => k.status === 'flying');
        if (activeKites.length > 0) {
          const randomKite = activeKites[Math.floor(Math.random() * activeKites.length)];
          const spectator = `Torcedor_${Math.floor(Math.random() * 899 + 100)}`;
          const msg = commentTemplate.replace('{name}', randomKite.nickname);
          addFeedItem({ type: 'comment', nickname: spectator, message: msg, icon: '💬' });
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [addFeedItem]);

  const triggerBattle = useCallback(
    (forcedChallengerId?: string) => {
      if (battleInProgressRef.current) return;

      const activeKites = kitesRef.current.filter((k) => k.status === 'flying');
      if (activeKites.length < 2) return;

      let kite1: KiteState | undefined;
      let kite2: KiteState | undefined;

      if (forcedChallengerId) {
        kite1 = activeKites.find((k) => k.id === forcedChallengerId);
        kite2 = activeKites.find((k) => k.id !== forcedChallengerId);
      }

      if (!kite1 || !kite2) {
        const shuffled = [...activeKites].sort(() => Math.random() - 0.5);
        kite1 = shuffled[0];
        kite2 = shuffled[1];
      }

      if (!kite1 || !kite2 || kite1.id === kite2.id) return;

      battleInProgressRef.current = true;
      soundFX.playBattleAlert();

      const bx = (kite1.x + kite2.x) / 2;
      const by = (kite1.y + kite2.y) / 2;

      const newBattle: BattleState = {
        id: `battle_${Date.now()}`,
        kite1Id: kite1.id,
        kite2Id: kite2.id,
        kite1Name: kite1.nickname,
        kite2Name: kite2.nickname,
        kite1Color: kite1.primaryColor,
        kite2Color: kite2.primaryColor,
        startTime: Date.now(),
        duration: 3500,
        x: bx,
        y: by,
        winnerId: null,
        status: 'alert',
        clashSparks: [],
      };

      setCurrentBattle(newBattle);
      addFeedItem({
        type: 'battle_start',
        nickname: kite1.nickname,
        targetNickname: kite2.nickname,
        message: `entrou em duelo cruzado contra @${kite2.nickname}!`,
        icon: '⚔️',
      });

      setKites((prev) =>
        prev.map((k) =>
          k.id === kite1?.id || k.id === kite2?.id
            ? { ...k, targetX: bx + (Math.random() - 0.5) * 6, targetY: by + (Math.random() - 0.5) * 6, status: 'battling' }
            : k
        )
      );

      setTimeout(() => {
        soundFX.playLineClash();
        setCurrentBattle((prev) => (prev ? { ...prev, status: 'clashing' } : null));
      }, 1000);

      setTimeout(() => {
        const score1 = kite1.score + (kite1.lineType !== 'linha10' ? 15 : 0);
        const score2 = kite2.score + (kite2.lineType !== 'linha10' ? 15 : 0);
        const totalWeight = score1 + score2 + 50;
        const prob1 = (score1 + 25) / totalWeight;
        const kite1Wins = Math.random() < prob1;
        const winner = kite1Wins ? kite1 : kite2;
        const loser = kite1Wins ? kite2 : kite1;

        soundFX.playCutSnap();
        if (loser.id === userKiteId) setUserKiteCut(true);

        setKites((prev) =>
          prev.map((k) => {
            if (k.id === winner.id) {
              const nextCombo = k.combo + 1;
              const nextScore = k.score + 10 * Math.min(nextCombo, 5);
              if (k.isUser) {
                confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                soundFX.playVictory();
              }
              return { ...k, score: nextScore, wins: k.wins + 1, combo: nextCombo, status: 'victorious' };
            }
            if (k.id === loser.id) return { ...k, status: 'falling', fallProgress: 0, fallAngle: 0, combo: 1 };
            return k;
          })
        );

        const winnerCombo = winner.combo + 1;
        const pointsGained = 10 * Math.min(winnerCombo, 5);
        setVictoryAnnouncement({ winnerName: winner.nickname, loserName: loser.nickname, combo: winnerCombo, score: pointsGained });
        addFeedItem({ type: 'battle_win', nickname: winner.nickname, targetNickname: loser.nickname, message: `CORTOU @${loser.nickname}! (+${pointsGained} pts)`, icon: '✂️' });
        setStats((prev) => ({ ...prev, totalBattles: prev.totalBattles + 1 }));
        setCurrentBattle(null);

        setTimeout(() => {
          setKites((prev) => prev.map((k) => (k.id === winner.id ? { ...k, status: 'flying' } : k)));
          setVictoryAnnouncement(null);
          battleInProgressRef.current = false;
        }, 2200);
      }, 3500);
    },
    [userKiteId, addFeedItem]
  );

  // Auto Battle Trigger Timer
  useEffect(() => {
    const battleInterval = setInterval(() => triggerBattle(), 7000);
    return () => clearInterval(battleInterval);
  }, [triggerBattle]);

  // Check Leaderboard Updates & New Leader Crown Alert
  useEffect(() => {
    if (kites.length === 0) return;

    const sorted = [...kites].sort((a, b) => b.score - a.score);
    const topLeader = sorted[0];

    if (topLeader && topLeader.score > 0 && topLeader.id !== currentLeaderIdRef.current) {
      currentLeaderIdRef.current = topLeader.id;
      setKites((prev) =>
        prev.map((k) => ({ ...k, crown: k.id === topLeader.id, rank: sorted.findIndex((sk) => sk.id === k.id) + 1 }))
      );
      setNewLeaderAlert(topLeader.nickname);
      addFeedItem({ type: 'new_leader', nickname: topLeader.nickname, message: 'assumiu o TOP 1 e é o NOVO LÍDER DA ARENA! 👑', icon: '🚨' });
      setTimeout(() => setNewLeaderAlert(null), 3500);
    } else {
      setKites((prev) => prev.map((k) => ({ ...k, rank: sorted.findIndex((sk) => sk.id === k.id) + 1 })));
    }
  }, [kites, addFeedItem]);

  // Random Arena Events Generator
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (Math.random() < 0.45 && !currentEvent) {
        const eventsList: { type: ArenaEvent['type']; title: string; desc: string; icon: string }[] = [
          { type: 'VENTO_FORTE', title: '🌪️ VENTO FORTE!', desc: 'A ventania acelerou todas as pipas na arena!', icon: '🌪️' },
          { type: 'BATALHA_DUPLA', title: '⚡ BATALHA DUPLA!', desc: 'Confrontos instantâneos nos céus!', icon: '⚔️' },
          { type: 'MODO_INSANO', title: '🔥 MODO INSANO!', desc: 'Frequência de combates multiplicada!', icon: '🔥' },
          { type: 'DESAFIO_CAMPEAO', title: '🎯 DESAFIO DO CAMPEÃO!', desc: 'A arena está buscando desafiar o líder do ranking!', icon: '👑' },
        ];

        const ev = eventsList[Math.floor(Math.random() * eventsList.length)];
        const newEvent: ArenaEvent = { id: `ev_${Date.now()}`, type: ev.type, title: ev.title, description: ev.desc, icon: ev.icon, expiresAt: Date.now() + 8000 };
        setCurrentEvent(newEvent);
        addFeedItem({ type: 'event', nickname: 'ARENA', message: `${ev.title} ${ev.desc}`, icon: ev.icon });

        if (ev.type === 'VENTO_FORTE') setWindSpeed(2.2);
        else if (ev.type === 'BATALHA_DUPLA' || ev.type === 'MODO_INSANO') triggerBattle();

        setTimeout(() => {
          setCurrentEvent(null);
          setWindSpeed(1.0);
        }, 8000);
      }
    }, 18000);

    return () => clearInterval(eventInterval);
  }, [currentEvent, triggerBattle, addFeedItem]);

  const handleUserJoin = (nickname: string) => {
    const cleanNickname = nickname.trim();
    if (!cleanNickname) return;

    setUserNickname(cleanNickname);
    setUserKiteCut(false);
    soundFX.playEnter();

    const x = 22 + Math.random() * 56;
    const targetY = 18 + Math.random() * 45;
    const newUserKiteId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const newUserKite: KiteState = {
      id: newUserKiteId,
      nickname: cleanNickname,
      isUser: true,
      isBot: false,
      shape: userCustoms.shape,
      primaryColor: userCustoms.primaryColor,
      secondaryColor: userCustoms.secondaryColor,
      pattern: userCustoms.pattern,
      lineType: userCustoms.lineType,
      x,
      y: 95,
      vx: 0,
      vy: -0.6,
      angle: 0,
      targetX: x,
      targetY,
      score: 0,
      wins: 0,
      combo: 1,
      status: 'entering',
      tailNodes: Array.from({ length: 8 }, (_, idx) => ({ x: (x / 100) * 450, y: 800 + idx * 12 })),
      entryProgress: 0,
      fallProgress: 0,
      fallAngle: 0,
      lastBattleTime: Date.now(),
      crown: false,
    };

    setUserKiteId(newUserKiteId);
    setKites((prev) => [...prev, newUserKite]);
    addFeedItem({ type: 'join', nickname: cleanNickname, message: 'entrou oficialmente na arena de PIPA COMBATE!', icon: '🔥' });
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
  };

  const handleUserRespawn = () => {
    if (userNickname) handleUserJoin(userNickname);
  };

  const handleSaveCustomization = (config: { shape: KiteShape; primaryColor: string; secondaryColor: string; pattern: KitePattern; lineType: LineType }) => {
    setUserCustoms(config);
    if (userKiteId) {
      setKites((prev) => prev.map((k) => k.id === userKiteId ? { ...k, ...config } : k));
    }
  };

  const handleCanvasClick = (x: number, y: number) => {
    soundFX.playHeartPop();
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#38bdf8', '#facc15'];
    const newHeart: TikTokHeart = {
      id: Math.random().toString(),
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: 0.8 + Math.random() * 0.6,
      rotation: Math.random() * 40 - 20,
    };
    setHearts((prev) => [...prev.slice(-15), newHeart]);
    setStats((prev) => ({ ...prev, likeCount: prev.likeCount + 1 }));
  };

  const userKite = kites.find((k) => k.id === userKiteId);

  return (
    <div className="w-full h-screen bg-slate-950 flex items-center justify-center p-0 sm:p-4 overflow-hidden select-none">
      <div className="relative w-full h-full sm:max-w-[420px] sm:max-h-[820px] sm:rounded-[36px] bg-slate-900 overflow-hidden shadow-2xl border-0 sm:border-4 sm:border-slate-800 flex flex-col justify-between">
        {/* Top area intentionally contains ONLY the ranking */}
        <RankingPanel kites={kites} newLeaderAlert={newLeaderAlert} />

        <div className="relative w-full h-full flex-1">
          <ArenaCanvas kites={kites} currentBattle={currentBattle} windSpeed={windSpeed} onCanvasClick={handleCanvasClick} />
          <TikTokHearts hearts={hearts} />
          <BattleBannerOverlay battle={currentBattle} victoryAnnouncement={victoryAnnouncement} />
        </div>

        <EventFeed feed={feed} />

        <BottomInputBar
          userKiteActive={!!userKite && userKite.status !== 'falling' && !userKiteCut}
          userKiteCut={userKiteCut}
          userNickname={userNickname}
          userScore={userKite?.score || 0}
          userCombo={userKite?.combo || 1}
          onJoinBattle={handleUserJoin}
          onRespawn={handleUserRespawn}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onRequestInstantBattle={() => {
            if (userKiteId) triggerBattle(userKiteId);
          }}
        />

        <KiteCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          currentShape={userCustoms.shape}
          currentPrimaryColor={userCustoms.primaryColor}
          currentSecondaryColor={userCustoms.secondaryColor}
          currentPattern={userCustoms.pattern}
          currentLineType={userCustoms.lineType}
          onSaveCustomization={handleSaveCustomization}
        />
      </div>
    </div>
  );
}
