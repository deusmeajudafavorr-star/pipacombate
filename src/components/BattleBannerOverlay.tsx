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
            className="w-full max-w-[165px] bg-slate-950/90 backdrop-blur-md rounded-lg border border-amber-400/60 p-1.5 text-white shadow-lg shadow-amber-500/20 flex flex-col items-center gap-1"
          >
            <div className="flex items-center gap-0.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 px-1.5 py-0.5 rounded-full text-[7px] font-black tracking-wide text-slate-950 uppercase animate-pulse shadow-sm">
              <Zap className="w-2.5 h-2.5 fill-slate-950" />
              <span>⚡ BATALHA!</span>
              <Zap className="w-2.5 h-2.5 fill-slate-950" />
            </div>

            <div className="flex items-center justify-between w-full px-0.5">
              <div className="flex flex-col items-center text-center max-w-[58px]">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm border border-white/30"
                  style={{ backgroundColor: battle.kite1Color }}
                >
                  🪁
                </div>
                <span className="font-extrabold text-[7px] truncate max-w-[58px] mt-0.5 text-amber-200">
                  @{battle.kite1Name}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-red-600/90 flex items-center justify-center font-black text-[8px] text-white shadow-sm shadow-red-500/30 border border-white/30 animate-bounce">
                  VS
                </div>
                <Swords className="w-3 h-3 text-amber-400 mt-0.5" style={{ animation: 'spin 3s linear infinite' }} />
              </div>

              <div className="flex flex-col items-center text-center max-w-[58px]">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm border border-white/30"
                  style={{ backgroundColor: battle.kite2Color }}
                >
                  🪁
                </div>
                <span className="font-extrabold text-[7px] truncate max-w-[58px] mt-0.5 text-cyan-200">
                  @{battle.kite2Name}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden border border-amber-400/15">
              <motion.div
                className="bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: battle.duration / 1000, ease: 'linear' }}
              />
            </div>
            <span className="text-[6px] text-amber-300 font-bold uppercase tracking-wide animate-pulse">
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
            className="w-full max-w-[175px] bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-emerald-950/90 backdrop-blur-md rounded-lg border border-emerald-400/60 p-1.5 text-white shadow-lg shadow-emerald-500/20 flex flex-col items-center gap-0.5 text-center"
          >
            <div className="flex items-center gap-0.5 text-amber-300 text-[7px] font-black uppercase tracking-wide">
              <Award className="w-2.5 h-2.5 text-amber-400" />
              <span>RESULTADO</span>
            </div>

            <div className="text-[9px] sm:text-[10px] font-black text-white leading-tight max-w-full">
              🎉 <span className="text-emerald-400">@{victoryAnnouncement.winnerName}</span> CORTOU{' '}
              <span className="text-red-400 line-through decoration-red-500 decoration-1">
                @{victoryAnnouncement.loserName}
              </span>
              !
            </div>

            <div className="flex items-center gap-1 mt-0.5">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1 py-0.5 rounded-full font-bold text-[7px]">
                +{victoryAnnouncement.score} PONTOS
              </span>

              {victoryAnnouncement.combo > 1 && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1 py-0.5 rounded-full font-black text-[7px] flex items-center gap-0.5 animate-pulse">
                  <Flame className="w-2 h-2 text-amber-400 fill-amber-400" />
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
