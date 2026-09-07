import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArenaEvent } from '../types';

interface ArenaEventBannerProps {
  currentEvent: ArenaEvent | null;
}

export const ArenaEventBanner: React.FC<ArenaEventBannerProps> = ({ currentEvent }) => {
  return (
    <div className="absolute top-28 left-0 right-0 z-20 pointer-events-none flex justify-center px-4">
      <AnimatePresence>
        {currentEvent && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-purple-950/90 via-indigo-950/95 to-purple-950/90 backdrop-blur-md rounded-2xl border-2 border-purple-400/80 px-4 py-2 text-white shadow-2xl shadow-purple-500/40 flex items-center gap-2.5 max-w-xs text-center"
          >
            <span className="text-2xl animate-bounce">{currentEvent.icon}</span>
            <div className="flex flex-col items-start text-left">
              <span className="font-black text-xs text-purple-300 uppercase tracking-wider">
                {currentEvent.title}
              </span>
              <span className="text-[11px] text-slate-200 font-semibold leading-tight">
                {currentEvent.description}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
