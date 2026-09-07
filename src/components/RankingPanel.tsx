import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { KiteState } from '../types';

interface RankingPanelProps {
  kites: KiteState[];
  newLeaderAlert: string | null;
}

export const RankingPanel: React.FC<RankingPanelProps> = ({ kites, newLeaderAlert }) => {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...kites].sort((a, b) => b.score - a.score || b.wins - a.wins);
  const topList = sorted.slice(0, expanded ? 10 : 5);

  return (
    <div className="absolute top-14 left-1.5 z-20 pointer-events-auto flex flex-col gap-0.5 max-w-[142px] sm:max-w-[155px]">
      <AnimatePresence>
        {newLeaderAlert && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0, x: -12 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.6, opacity: 0, x: -12 }}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-slate-950 font-black text-[8px] px-1.5 py-0.5 rounded-lg shadow-md border border-amber-300 flex items-center gap-1 animate-bounce"
          >
            <Crown className="w-2.5 h-2.5 fill-slate-950" />
            <div className="truncate">
              <span>🚨 NOVO LÍDER</span>
              <div className="truncate text-white font-extrabold text-[9px]">@{newLeaderAlert}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-950/80 backdrop-blur-md rounded-xl border border-amber-400/25 p-1 text-white shadow-lg shadow-black/50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-[8px] font-extrabold text-amber-300 border-b border-white/10 pb-0.5 mb-1 transition hover:text-amber-200"
        >
          <div className="flex items-center gap-0.5">
            <Trophy className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span>RANKING</span>
          </div>
          {expanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
        </button>

        <div className="flex flex-col gap-0.5">
          {topList.map((kite, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div
                key={kite.id}
                className={`flex items-center justify-between text-[8px] px-1 py-px rounded-md ${
                  kite.isUser
                    ? 'bg-red-600/35 border border-red-500/70 font-bold'
                    : isFirst
                    ? 'bg-amber-500/15 text-amber-200 font-extrabold border border-amber-400/25'
                    : ''
                }`}
              >
                <div className="flex items-center gap-0.5 truncate min-w-0">
                  <span className="w-3 text-center font-black text-[8px] shrink-0">
                    {isFirst ? '👑' : isSecond ? '🥈' : isThird ? '🥉' : `${index + 1}.`}
                  </span>
                  <span className={`truncate text-[8px] ${kite.isUser ? 'text-amber-300 font-extrabold' : 'text-slate-100'}`}>
                    {kite.nickname}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-[8px] font-mono font-bold text-amber-300 shrink-0">
                  {kite.combo > 1 && <span className="text-orange-400 text-[7px]">🔥x{kite.combo}</span>}
                  <span>{kite.score}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-0.5 pt-0.5 border-t border-white/10 text-[7px] text-slate-400 text-center font-medium">
          {expanded ? 'Fechar' : `+${Math.max(0, kites.length - 5)} pipas`}
        </div>
      </div>
    </div>
  );
};
