import React from 'react';
import { Volume2, VolumeX, Flame, Users, Trophy, Radio, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { GameStats } from '../types';

interface HeaderOverlayProps {
  stats: GameStats;
  kiteCount: number;
  muted: boolean;
  onToggleMute: () => void;
  onManualTriggerBattle?: () => void;
  onResetDemo?: () => void;
}

export const HeaderOverlay: React.FC<HeaderOverlayProps> = ({
  stats,
  kiteCount,
  muted,
  onToggleMute,
  onManualTriggerBattle,
  onResetDemo,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 p-2 sm:p-3 pointer-events-none flex flex-col gap-1 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white">
      {/* Top Bar Row 1 */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Brand & Live Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 p-[2px] rounded-full shadow-lg shadow-red-500/30">
            <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-amber-400/30">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse fill-orange-400" />
              <span className="font-['Outfit'] font-black text-xs sm:text-sm tracking-wider bg-gradient-to-r from-amber-300 via-orange-300 to-red-400 bg-clip-text text-transparent">
                PIPA COMBATE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-red-600/90 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-widest shadow-md shadow-red-600/40 animate-pulse">
            <Radio className="w-3 h-3 text-white" />
            <span>AO VIVO</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 sm:p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/20 text-white transition active:scale-95 shadow-md"
            title={muted ? 'Ativar Som' : 'Desativar Som'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Quick Trigger Battle Test Button */}
          {onManualTriggerBattle && (
            <button
              onClick={onManualTriggerBattle}
              className="px-2 py-1 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 font-bold text-[10px] sm:text-xs flex items-center gap-1 transition active:scale-95 shadow-md border border-amber-300/40"
              title="Forçar Duelo Rápido"
            >
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span className="hidden sm:inline">DUELO!</span>
            </button>
          )}

          {/* Reset Demo Arena */}
          {onResetDemo && (
            <button
              onClick={onResetDemo}
              className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/20 text-slate-300 transition active:scale-95 shadow-md"
              title="Reiniciar Arena"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Live Stats & Season Tag */}
      <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-200 mt-0.5 px-0.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold">{kiteCount}</span>
            <span className="text-slate-300 text-[10px]">PIPAS NA ARENA</span>
          </div>

          <div className="hidden xs:flex items-center gap-1 bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-bounce" />
            <span className="text-pink-300 font-bold">{(stats.likeCount / 1000).toFixed(1)}k</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-amber-400/20 text-amber-300">
          <Trophy className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] uppercase font-extrabold tracking-wider">{stats.seasonName}</span>
        </div>
      </div>
    </div>
  );
};
