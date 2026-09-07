import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, RefreshCw, Palette, Zap, Flame, RotateCcw } from 'lucide-react';

interface BottomInputBarProps {
  userKiteActive: boolean;
  userKiteCut: boolean;
  userNickname: string;
  userScore: number;
  userCombo: number;
  onJoinBattle: (nickname: string) => void;
  onRespawn: () => void;
  onOpenCustomizer: () => void;
  onResetArena: () => void;
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
  onResetArena,
  onRequestInstantBattle,
}) => {
  const [nicknameInput, setNicknameInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nickname = nicknameInput.trim();
    if (!nickname) return;
    onJoinBattle(nickname);
    setNicknameInput('');
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 p-2 sm:p-3 pointer-events-auto bg-gradient-to-t from-black via-black/90 to-transparent border-t border-white/10 text-white">
      <div className="flex flex-col gap-1.5 w-full">
        {userNickname && (
          <div className="flex items-center justify-between gap-2 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-emerald-500/30 shadow-lg">
            <div className="flex items-center gap-2 truncate pl-1">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xs shadow-md animate-pulse">
                🪁
              </div>
              <div className="truncate">
                <div className="text-[11px] font-black text-emerald-300 truncate">@{userNickname}</div>
                <div className="text-[9px] text-slate-300 font-bold flex items-center gap-1">
                  <span>⭐ {userScore} pts</span>
                  {userCombo > 1 && <span className="text-amber-400 font-black">| 🔥x{userCombo}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {userKiteActive && onRequestInstantBattle && (
                <button
                  onClick={onRequestInstantBattle}
                  className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md active:scale-95 transition"
                >
                  <Zap className="w-3 h-3 fill-slate-950" />
                  <span>DESAFIAR</span>
                </button>
              )}

              <button
                onClick={onOpenCustomizer}
                className="p-1.5 rounded-lg bg-slate-800 border border-white/20 text-slate-200 hover:bg-slate-700 active:scale-95 transition"
                title="Personalizar próxima pipa"
              >
                <Palette className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>
        )}

        {userKiteCut && (
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-between gap-2 px-2 py-1.5 bg-red-950/80 rounded-xl border border-red-500/70 shadow-lg shadow-red-500/20"
          >
            <div className="flex items-center gap-1.5 text-red-300 font-black text-[10px] uppercase">
              <Flame className="w-3.5 h-3.5 fill-red-500" />
              <span>Última pipa foi cortada</span>
            </div>
            <button
              onClick={onRespawn}
              className="py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-md active:scale-95 transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>ENTRAR DE NOVO</span>
            </button>
          </motion.div>
        )}

        <form onSubmit={handleFormSubmit} className="flex items-center gap-1.5 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="Digite um nickname para soltar uma nova pipa..."
              maxLength={16}
              className="w-full py-2.5 px-3 pr-9 rounded-xl bg-slate-900/95 border border-amber-400/40 text-white placeholder-slate-400 text-xs font-bold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
            />
            <button
              type="button"
              onClick={onOpenCustomizer}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-300 hover:text-amber-200 p-1"
              title="Escolher pipa, cores e linha para as próximas entradas"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!nicknameInput.trim()}
            className="py-2.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition shrink-0"
          >
            <span>SOLTAR PIPA</span>
            <Send className="w-3.5 h-3.5 fill-slate-950" />
          </button>

          <button
            type="button"
            onClick={onResetArena}
            title="Resetar arena e remover todas as pipas"
            aria-label="Resetar arena"
            className="p-2.5 rounded-xl bg-slate-800/95 border border-red-400/40 text-red-300 hover:bg-red-950/70 hover:text-red-200 active:scale-95 transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-[9px] text-slate-400 text-center font-medium">
          Cada nickname enviado entra como uma nova pipa na arena • sem substituir as anteriores
        </div>
      </div>
    </div>
  );
};
