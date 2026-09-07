export const BOT_NICKNAMES = [
  'ReiDoCerol',
  'PipaMaster',
  'MestreDaLinha',
  'CortaTudo',
  'PipaInsana',
  'CerolPassado',
  'Ventania99',
  'DonoDeLinha',
  'SombraDosCeus',
  'LendaDoBairro',
  'ChileanaPro',
  'PeixinhoVoador',
  'CortaEDesce',
  'PipaDeOuro',
  'CerolCanoas',
  'CerolNaLinha',
  'VoadorNoturno',
  'MestreChileano',
  'GuerreiroDaPipa',
  'LinhaDeAco',
  'BicudoCortador',
  'DueloNasNuvens',
  'CerolBruto',
  'PipaBrasil',
  'ImperadorPipa',
  'BicoDeFerro',
  'TornadoVoador',
  'ReiDoCombate',
];

export const SPECTATOR_COMMENTS = [
  'Nossa senhora, que cerol passado!! 😱',
  'Pipa do {name} tá voando demais! 🔥',
  'Corta tudo mesmo! ✂️',
  'Manda buscar que tá no alto!! 🪁',
  'Quem aí é do time Cerol? 🙋‍♂️',
  'A batalha no topo tá insana!! ⚡',
  'O {name} tá imbatível hoje!! 👑',
  'Olha a linha tensionada!! 💥',
  'Bota pra descer!! 🚀',
  'Essa pipa de {name} tem asa de avião! ✈️',
  'Tira da reta que o cerol corta! ✂️',
  'Mandou buscar lá no morro! 🏔️',
  'Ao vivo tá emocionante demais! 🔴',
  'Combo de vitórias absurdo!! 🔥🔥',
  'Bora subir no ranking! 🏆',
];

export const KITE_COLORS = [
  { primary: '#ef4444', secondary: '#fef08a' }, // Red & Yellow
  { primary: '#3b82f6', secondary: '#ffffff' }, // Blue & White
  { primary: '#10b981', secondary: '#facc15' }, // Green & Yellow (Brasil)
  { primary: '#a855f7', secondary: '#38bdf8' }, // Purple & Cyan
  { primary: '#f97316', secondary: '#111827' }, // Orange & Dark
  { primary: '#ec4899', secondary: '#fef08a' }, // Pink & Yellow
  { primary: '#06b6d4', secondary: '#10b981' }, // Cyan & Mint
  { primary: '#8b5cf6', secondary: '#f43f5e' }, // Violet & Rose
  { primary: '#eab308', secondary: '#3b82f6' }, // Gold & Blue
  { primary: '#0284c7', secondary: '#ea580c' }, // Sky Blue & Orange
];

export function getRandomBotNickname(existingNames: string[]): string {
  const available = BOT_NICKNAMES.filter((n) => !existingNames.includes(n));
  if (available.length === 0) {
    return `Pipa_${Math.floor(Math.random() * 899 + 100)}`;
  }
  return available[Math.floor(Math.random() * available.length)];
}

export function getRandomColorPair() {
  return KITE_COLORS[Math.floor(Math.random() * KITE_COLORS.length)];
}
