import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Shield, Palette } from 'lucide-react';
import { KiteShape, KitePattern, LineType } from '../types';

interface KiteCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShape: KiteShape;
  currentPrimaryColor: string;
  currentSecondaryColor: string;
  currentPattern: KitePattern;
  currentLineType: LineType;
  onSaveCustomization: (config: {
    shape: KiteShape;
    primaryColor: string;
    secondaryColor: string;
    pattern: KitePattern;
    lineType: LineType;
  }) => void;
}

const SHAPES: { id: KiteShape; label: string; desc: string }[] = [
  { id: 'diamante', label: 'Diamante', desc: 'Clássica, equilibrada' },
  { id: 'raia', label: 'Raia', desc: 'Rápida no corte' },
  { id: 'peixinho', label: 'Peixinho', desc: 'Agulha nos céus' },
  { id: 'brit', label: 'Brit', desc: 'Resistente ao vento' },
  { id: 'pipao', label: 'Pipão', desc: 'Imponente, cauda longa' },
];

const PATTERNS: { id: KitePattern; label: string }[] = [
  { id: 'brasil', label: '🇧🇷 Brasil' },
  { id: 'flames', label: '🔥 Chamas' },
  { id: 'cyber', label: '⚡ Cyber' },
  { id: 'cerol', label: '✂️ Cerol' },
  { id: 'stripes', label: '🎨 Listras' },
  { id: 'cross', label: '✝️ Cruz' },
  { id: 'neon', label: '🌟 Neon' },
];

const LINES: { id: LineType; label: string; desc: string; color: string }[] = [
  { id: 'linha10', label: 'Linha 10', desc: 'Padrão e resistente', color: 'bg-slate-200' },
  { id: 'chileana', label: 'Linha Chileana', desc: 'Corte rápido e preciso', color: 'bg-red-500' },
  { id: 'cerol_extra', label: 'Cerol Extra', desc: 'Atrito máximo nas batalhas', color: 'bg-amber-400' },
];

const COLOR_PRESETS = [
  { primary: '#ef4444', secondary: '#fef08a', name: 'Vermelho & Amarelo' },
  { primary: '#10b981', secondary: '#facc15', name: 'Verde & Amarelo (Brasil)' },
  { primary: '#3b82f6', secondary: '#ffffff', name: 'Azul & Branco' },
  { primary: '#a855f7', secondary: '#38bdf8', name: 'Roxo & Ciano' },
  { primary: '#f97316', secondary: '#111827', name: 'Laranja & Preto' },
  { primary: '#ec4899', secondary: '#fef08a', name: 'Rosa Neon' },
];

export const KiteCustomizerModal: React.FC<KiteCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentShape,
  currentPrimaryColor,
  currentSecondaryColor,
  currentPattern,
  currentLineType,
  onSaveCustomization,
}) => {
  const [shape, setShape] = useState<KiteShape>(currentShape);
  const [primaryColor, setPrimaryColor] = useState(currentPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState(currentSecondaryColor);
  const [pattern, setPattern] = useState<KitePattern>(currentPattern);
  const [lineType, setLineType] = useState<LineType>(currentLineType);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveCustomization({
      shape,
      primaryColor,
      secondaryColor,
      pattern,
      lineType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-4 sm:p-6 w-full max-w-md text-white shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar flex flex-col gap-4"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <h2 className="font-['Outfit'] font-black text-base sm:text-lg text-amber-300">
              CUSTOMIZAR PIPA E LINHA
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Shape Choice */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            1. Modelo da Pipa
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SHAPES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setShape(s.id)}
                className={`p-2 rounded-xl border text-left flex flex-col justify-between transition ${
                  shape === s.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs">{s.label}</span>
                  {shape === s.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Colors */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            2. Cores da Pipa
          </span>
          <div className="grid grid-cols-3 gap-2">
            {COLOR_PRESETS.map((cp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrimaryColor(cp.primary);
                  setSecondaryColor(cp.secondary);
                }}
                className={`p-2 rounded-xl border flex items-center gap-2 transition ${
                  primaryColor === cp.primary && secondaryColor === cp.secondary
                    ? 'border-amber-400 bg-amber-500/20'
                    : 'border-white/10 bg-slate-800/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center -space-x-1">
                  <div className="w-4 h-4 rounded-full border border-white/40" style={{ backgroundColor: cp.primary }} />
                  <div className="w-4 h-4 rounded-full border border-white/40" style={{ backgroundColor: cp.secondary }} />
                </div>
                <span className="text-[10px] font-bold truncate">{cp.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Pattern */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            3. Estampa / Estilo
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPattern(p.id)}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition ${
                  pattern === p.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Line Type */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            4. Tipo de Linha
          </span>
          <div className="flex flex-col gap-2">
            {LINES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLineType(l.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition ${
                  lineType === l.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${l.color}`} />
                  <div>
                    <div className="font-extrabold text-xs">{l.label}</div>
                    <div className="text-[10px] text-slate-400">{l.desc}</div>
                  </div>
                </div>
                {lineType === l.id && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 transition active:scale-95"
        >
          SALVAR E APLICAR PIPA
        </button>
      </motion.div>
    </div>
  );
};
