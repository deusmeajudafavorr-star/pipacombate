import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Crown, ChevronDown, ChevronUp, Flame, Star, ShieldAlert } from 'lucide-react';
import { KiteState } from '../types';

interface RankingPanelProps {
  kites: KiteState[];
  newLeaderAlert: string | null;
}

export const RankingPanel: React.FC<RankingPanelProps> = ({ kites, newLeaderAlert }) => {
  const [expanded, setExpanded] = useState(false);

  // Sort top kites by score descending
  const sorted = [...kites].sort((a, b) => b.score - a.score || b.wins - a.wins);
  const topList = sorted.slice(0, expanded ? 10 : 5);

  return (
    <div className="absolute top-16 left-2 z-20 pointer-events-auto flex flex-col gap-1 max-w-[180px] sm:max-w-[210px]">
      {/* New Leader Alert Banner */}
      <AnimatePresence>
        {newLeaderAlert && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0, x: -20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.6, opacity: 0, x: -20 }}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-slate-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-xl shadow-lg border border-amber-300 flex items-center gap-1.5 animate-bounce"
          >
            <Crown className="w-3.5 h-3.5 fill-slate-950" />
            <div className="truncate">
              <span>🚨 NOVO LÍDER!</span>
              <div className="truncate text-white font-extrabold text-[11px]">@{newLeaderAlert}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Ranking Box */}
      <div className="bg-slate-950/85 backdrop-blur-md rounded-2xl border border-amber-400/30 p-2 text-white shadow-xl shadow-black/60">
        {/* Title Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-[11px] font-extrabold text-amber-300 border-b border-white/10 pb-1 mb-1.5 transition hover:text-amber-200"
        >
          <div className="flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>RANKING AO VIVO</span>
          </div>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Top Players List */}
        <div className="flex flex-col gap-1">
          {topList.map((kite, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div
                key={kite.id}
                className={`flex items-center justify-between text-[11px] px-1.5 py-0.5 rounded-lg transition-all ${
                  kite.isUser
                    ? 'bg-red-600/40 border border-red-500/80 font-bold'
                    : isFirst
                    ? 'bg-amber-500/20 text-amber-200 font-extrabold border border-amber-400/30'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                  <span className="w-4 text-center font-black text-[10px]">
                    {isFirst ? '👑' : isSecond ? '🥈' : isThird ? '🥉' : `${index + 1}.`}
                  </span>

                  <span
                    className={`truncate text-[10px] sm:text-[11px] ${
                      kite.isUser ? 'text-amber-300 font-extrabold' : 'text-slate-100'
                    }`}
                  >
                    {kite.nickname}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300">
                  {kite.combo > 1 && (
                    <span className="text-orange-400 font-black flex items-center text-[9px]">
                      🔥x{kite.combo}
                    </span>
                  )}
                  <span>{kite.score}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Toggle Count */}
        <div className="mt-1 pt-1 border-t border-white/10 text-[9px] text-slate-400 text-center font-medium">
          {expanded ? 'Mostrar top 5' : `+ ${Math.max(0, kites.length - 5)} pipas voando`}
        </div>
      </div>
    </div>
  );
};
