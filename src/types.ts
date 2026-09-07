export type KiteShape = 'diamante' | 'raia' | 'peixinho' | 'brit' | 'pipao';

export type KitePattern = 'brasil' | 'flames' | 'cyber' | 'cerol' | 'stripes' | 'cross' | 'neon';

export type LineType = 'linha10' | 'chileana' | 'cerol_extra';

export interface TailNode {
  x: number;
  y: number;
}

export interface KiteState {
  id: string;
  nickname: string;
  isUser: boolean;
  isBot: boolean;
  shape: KiteShape;
  primaryColor: string;
  secondaryColor: string;
  pattern: KitePattern;
  lineType: LineType;
  x: number; // percentage 0 to 100
  y: number; // percentage 0 to 100
  vx: number;
  vy: number;
  angle: number; // degrees
  targetX: number;
  targetY: number;
  score: number;
  wins: number;
  combo: number;
  status: 'flying' | 'battling' | 'falling' | 'victorious' | 'entering';
  tailNodes: TailNode[];
  entryProgress: number; // 0 to 1
  fallProgress: number;  // 0 to 1
  fallAngle: number;
  lastBattleTime: number;
  crown: boolean;
  rank?: number;
}

export interface BattleState {
  id: string;
  kite1Id: string;
  kite2Id: string;
  kite1Name: string;
  kite2Name: string;
  kite1Color: string;
  kite2Color: string;
  startTime: number;
  duration: number; // in ms
  x: number; // position of battle
  y: number;
  winnerId: string | null;
  status: 'alert' | 'clashing' | 'ended';
  clashSparks: { x: number; y: number; vx: number; vy: number; color: string; life: number }[];
}

export type ArenaEventType = 'VENTO_FORTE' | 'BATALHA_DUPLA' | 'REI_DA_ARENA' | 'MODO_INSANO' | 'DESAFIO_CAMPEAO';

export interface ArenaEvent {
  id: string;
  type: ArenaEventType;
  title: string;
  description: string;
  icon: string;
  expiresAt: number;
}

export interface FeedItem {
  id: string;
  type: 'join' | 'battle_start' | 'battle_win' | 'combo' | 'rank_up' | 'new_leader' | 'comment' | 'event';
  nickname: string;
  targetNickname?: string;
  message: string;
  timestamp: number;
  icon: string;
  badgeColor?: string;
}

export interface TikTokHeart {
  id: string;
  x: number;
  y: number;
  color: string;
  scale: number;
  rotation: number;
}

export interface GameStats {
  viewersCount: number;
  totalBattles: number;
  seasonName: string;
  seasonTimeRemaining: string;
  likeCount: number;
}
