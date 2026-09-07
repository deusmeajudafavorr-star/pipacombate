import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, RefreshCw, Palette, Shield, Zap, Flame } from 'lucide-react';
import { KiteShape, KitePattern, LineType } from '../types';

interface BottomInputBarProps {
  userKiteActive: boolean;
  userKiteCut: boolean;
  userNickname: string;
  userScore: number;
  userCombo: number;
  onJoinBattle: (nickname: string) => void;
  onRespawn: () => void;
  onOpenCustomizer: () => void;
  onRequestInstantBattle?: () => void;
}

export const BottomInputBar: React.FC<BottomInputBarProps> = ({
  userKiteActive,
  userKiteCut,
  userNickname,
  userScore,
  userCombo,
  onJoinBattle,
  onRespawn,
  onOpenCustomizer,
  onRequestInstantBattle,
}) => {
  const [nicknameInput, setNicknameInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    onJoinBattle(nicknameInput.trim());
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 p-2 sm:p-3 pointer-events-auto bg-gradient-to-t from-black via-black/90 to-transparent border-t border-white/10 text-white">
      {/* CASE 1: User's Kite was Cut / Defeated */}
      {userKiteCut ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-2 p-2 bg-red-950/80 rounded-2xl border-2 border-red-500 shadow-lg shadow-red-500/30 text-center"
        >
          <div className="flex items-center gap-1.5 text-red-400 font-black text-xs uppercase tracking-wider animate-bounce">
            <Flame className="w-4 h-4 fill-red-500" />
            <span>SUA PIPA FOI CORTADA! 💥</span>
          </div>

          <div className="text-xs text-slate-200">
            Sua pipa caiu da arena. Volte para se vingar!
          </div>

          <div className="flex items-center gap-2 w-full max-w-xs mt-0.5">
            <button
              onClick={onRespawn}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 active:scale-95 transition"
            >
              <RefreshCw className="w-4 h-4 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
              <span>🪁 VOLTAR PARA A BATALHA!</span>
            </button>

            <button
              onClick={onOpenCustomizer}
              className="p-2.5 rounded-xl bg-slate-800 border border-amber-400/50 text-amber-300 hover:bg-slate-700 active:scale-95 transition"
              title="Mudar Pipa / Linha"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : userKiteActive ? (
        /* CASE 2: User's Kite is Flying Active in Arena */
        <div className="flex items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-emerald-500/40 shadow-xl">
          {/* Active User Info */}
          <div className="flex items-center gap-2 truncate pl-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-sm shadow-md animate-pulse">
              🪁
            </div>
            <div className="truncate">
              <div className="text-xs font-black text-emerald-300 truncate">@{userNickname}</div>
              <div className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                <span>⭐ {userScore} pts</span>
                {userCombo > 1 && <span className="text-amber-400 font-black">| 🔥x{userCombo}</span>}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onRequestInstantBattle && (
              <button
                onClick={onRequestInstantBattle}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md active:scale-95 transition"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>DESAFIAR!</span>
              </button>
            )}

            <button
              onClick={onOpenCustomizer}
              className="p-2 rounded-xl bg-slate-800 border border-white/20 text-slate-200 hover:bg-slate-700 active:scale-95 transition"
              title="Personalizar Pipa"
            >
              <Palette className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      ) : (
        /* CASE 3: Not Entered Yet (Input Nickname Form) */
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="Digite seu nickname..."
                maxLength={16}
                className="w-full py-2.5 px-3 pl-3 pr-8 rounded-xl bg-slate-900/90 border border-amber-400/40 text-white placeholder-slate-400 text-xs font-bold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
              />
              <button
                type="button"
                onClick={onOpenCustomizer}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-300 hover:text-amber-200 p-1"
                title="Escolher Pipa e Cores"
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!nicknameInput.trim()}
              className="py-2.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition shrink-0"
            >
              <span>ENTRAR</span>
              <Send className="w-3.5 h-3.5 fill-slate-950" />
            </button>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium">
            Entrada automática na arena • Duelos e cortes simulados ao vivo
          </div>
        </form>
      )}
    </div>
  );
};
