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
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-start pt-20 px-4">
      {/* Active Battle Alert Popup */}
      <AnimatePresence>
        {battle && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="w-full max-w-xs bg-slate-950/90 backdrop-blur-md rounded-2xl border-2 border-amber-400/80 p-3 text-white shadow-2xl shadow-amber-500/30 flex flex-col items-center gap-2"
          >
            {/* Header Alert Label */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 px-3 py-1 rounded-full text-xs font-black tracking-widest text-slate-950 uppercase animate-pulse shadow-md">
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>⚡ ALERTA DE BATALHA!</span>
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
            </div>

            {/* Duelists Row */}
            <div className="flex items-center justify-between w-full px-2 py-1">
              {/* Kite 1 */}
              <div className="flex flex-col items-center text-center max-w-[100px]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md border-2 border-white/40"
                  style={{ backgroundColor: battle.kite1Color }}
                >
                  🪁
                </div>
                <span className="font-extrabold text-xs truncate max-w-[90px] mt-1 text-amber-200">
                  @{battle.kite1Name}
                </span>
              </div>

              {/* VS Icon */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-600/90 flex items-center justify-center font-black text-xs text-white shadow-lg shadow-red-500/50 border border-white/50 animate-bounce">
                  VS
                </div>
                <Swords className="w-4 h-4 text-amber-400 mt-1 animate-spin" style={{ animationDuration: '3s' }} />
              </div>

              {/* Kite 2 */}
              <div className="flex flex-col items-center text-center max-w-[100px]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md border-2 border-white/40"
                  style={{ backgroundColor: battle.kite2Color }}
                >
                  🪁
                </div>
                <span className="font-extrabold text-xs truncate max-w-[90px] mt-1 text-cyan-200">
                  @{battle.kite2Name}
                </span>
              </div>
            </div>

            {/* Tension Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-amber-400/30">
              <motion.div
                className="bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: battle.duration / 1000, ease: 'linear' }}
              />
            </div>
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider animate-pulse">
              🔥 LINHAS CRUZADAS! CEROL CORRENDO...
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
            className="w-full max-w-xs bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-emerald-950/90 backdrop-blur-md rounded-2xl border-2 border-emerald-400/80 p-3 text-white shadow-2xl shadow-emerald-500/40 flex flex-col items-center gap-1.5 text-center"
          >
            <div className="flex items-center gap-1 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              <span>RESULTADO DO COMBATE</span>
            </div>

            <div className="text-sm sm:text-base font-black text-white leading-tight">
              🎉 <span className="text-emerald-400">@{victoryAnnouncement.winnerName}</span> CORTOU{' '}
              <span className="text-red-400 line-through decoration-red-500 decoration-2">
                @{victoryAnnouncement.loserName}
              </span>
              !
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold text-xs">
                +{victoryAnnouncement.score} PONTOS
              </span>

              {victoryAnnouncement.combo > 1 && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-black text-xs flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>COMBO x{victoryAnnouncement.combo}!</span>
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
