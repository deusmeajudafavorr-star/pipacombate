import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FeedItem } from '../types';

interface EventFeedProps {
  feed: FeedItem[];
}

export const EventFeed: React.FC<EventFeedProps> = ({ feed }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [feed]);

  return (
    <div className="absolute bottom-28 left-2 z-20 pointer-events-auto max-w-[180px] sm:max-w-[210px] w-full">
      <div
        ref={containerRef}
        className="max-h-[130px] sm:max-h-[160px] overflow-y-auto no-scrollbar flex flex-col gap-1 p-0.5 rounded-xl mask-linear-fade"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%)',
        }}
      >
        <AnimatePresence initial={false}>
          {feed.slice(-8).map((item) => {
            let bgClass = 'bg-slate-950/70 border-white/10 text-slate-200';
            let icon = '💬';

            if (item.type === 'join') {
              bgClass = 'bg-gradient-to-r from-red-950/80 to-amber-950/80 border-orange-500/40 text-orange-200';
              icon = '🔥';
            } else if (item.type === 'battle_win') {
              bgClass = 'bg-gradient-to-r from-emerald-950/80 to-slate-900/80 border-emerald-500/40 text-emerald-200';
              icon = '✂️';
            } else if (item.type === 'battle_start') {
              bgClass = 'bg-slate-900/80 border-amber-500/40 text-amber-200';
              icon = '⚔️';
            } else if (item.type === 'new_leader') {
              bgClass = 'bg-gradient-to-r from-amber-900/90 to-red-900/90 border-amber-400 text-amber-200 font-extrabold';
              icon = '👑';
            } else if (item.type === 'event') {
              bgClass = 'bg-purple-950/80 border-purple-400/50 text-purple-200 font-bold';
              icon = '🌪️';
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className={`text-[10px] px-2 py-1 rounded-xl backdrop-blur-md border shadow-md flex items-start gap-1.5 ${bgClass}`}
              >
                <span className="text-[12px] leading-none select-none shrink-0">{item.icon || icon}</span>
                <div className="leading-tight break-words min-w-0">
                  {item.nickname && (
                    <span className="font-extrabold mr-1 text-white opacity-90">
                      @{item.nickname}
                    </span>
                  )}
                  <span className="opacity-95">{item.message}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
