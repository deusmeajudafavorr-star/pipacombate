import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { TikTokHeart } from '../types';

interface TikTokHeartsProps {
  hearts: TikTokHeart[];
}

export const TikTokHearts: React.FC<TikTokHeartsProps> = ({ hearts }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, y: h.y, x: h.x, scale: h.scale, rotate: h.rotation }}
            animate={{
              opacity: 0,
              y: h.y - 120 - Math.random() * 80,
              x: h.x + (Math.random() * 60 - 30),
              scale: h.scale * 1.4,
              rotate: h.rotation + (Math.random() * 40 - 20),
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <Heart className="w-6 h-6 fill-current drop-shadow-md" style={{ color: h.color }} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
