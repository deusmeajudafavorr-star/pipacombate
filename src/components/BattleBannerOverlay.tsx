import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Zap, Award, Flame } from 'lucide-react';
import { BattleState } from '../types';

interface BattleBannerOverlayProps {
  battle: BattleState | null;
  victoryAnnouncement: {
    winnerName: string;
    loserName: string;
    combo: number;
    score: number;
  } | null;
}

export const BattleBannerOverlay: React.FC<BattleBannerOverlayProps> = ({
  battle,
  victoryAnnouncement,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-start pt-16 px-2">
      {/* Active Battle Alert Popup */}
      <AnimatePresence>
        {battle && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="w-full max-w-[200px] bg-slate-950/90 backdrop-blur-md rounded-xl border border-amber-400/70 p-2 text-white shadow-xl shadow-amber-500/25 flex flex-col items-center gap-1.5"
          >
            <div className="flex items-center gap-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide text-slate-950 uppercase animate-pulse shadow-md">
              <Zap className="w-3 h-3 fill-slate-950" />
              <span>⚡ BATALHA!</span>
              <Zap className="w-3 h-3 fill-slate-950" />
            </div>

            <div className="flex items-center justify-between w-full px-1">
              <div className="flex flex-col items-center text-center max-w-[72px]">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base shadow-md border border-white/40"
                  style={{ backgroundColor: battle.kite1Color }}
                >
                  🪁
                </div>
                <span className="font-extrabold text-[9px] truncate max-w-[70px] mt-0.5 text-amber-200">
                  @{battle.kite1Name}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-red-600/90 flex items-center justify-center font-black text-[9px] text-white shadow-md shadow-red-500/40 border border-white/40 animate-bounce">
                  VS
                </div>
                <Swords className="w-3.5 h-3.5 text-amber-400 mt-0.5" style={{ animation: 'spin 3s linear infinite' }} />
              </div>

              <div className="flex flex-col items-center text-center max-w-[72px]">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base shadow-md border border-white/40"
                  style={{ backgroundColor: battle.kite2Color }}
                >
                  🪁
                </div>
                <span className="font-extrabold text-[9px] truncate max-w-[70px] mt-0.5 text-cyan-200">
                  @{battle.kite2Name}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-amber-400/20">
              <motion.div
                className="bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: battle.duration / 1000, ease: 'linear' }}
              />
            </div>
            <span className="text-[8px] text-amber-300 font-bold uppercase tracking-wide animate-pulse">
              🔥 LINHAS CRUZADAS!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Announcement Banner */}
      <AnimatePresence>
        {victoryAnnouncement && !battle && (
          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-full max-w-[210px] bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-emerald-950/90 backdrop-blur-md rounded-xl border border-emerald-400/70 p-2 text-white shadow-xl shadow-emerald-500/25 flex flex-col items-center gap-1 text-center"
          >
            <div className="flex items-center gap-1 text-amber-300 text-[9px] font-black uppercase tracking-wide">
              <Award className="w-3 h-3 text-amber-400" />
              <span>RESULTADO</span>
            </div>

            <div className="text-[11px] sm:text-xs font-black text-white leading-tight max-w-full">
              🎉 <span className="text-emerald-400">@{victoryAnnouncement.winnerName}</span> CORTOU{' '}
              <span className="text-red-400 line-through decoration-red-500 decoration-1">
                @{victoryAnnouncement.loserName}
              </span>
              !
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-full font-bold text-[9px]">
                +{victoryAnnouncement.score} PONTOS
              </span>

              {victoryAnnouncement.combo > 1 && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full font-black text-[9px] flex items-center gap-0.5 animate-pulse">
                  <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <span>x{victoryAnnouncement.combo}</span>
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
