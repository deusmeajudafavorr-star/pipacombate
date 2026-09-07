import { KiteShape, KitePattern, KiteState } from '../types';

export function drawKiteOnCanvas(
  ctx: CanvasRenderingContext2D,
  kite: KiteState,
  canvasWidth: number,
  canvasHeight: number,
  time: number
) {
  const pixelX = (kite.x / 100) * canvasWidth;
  const pixelY = (kite.y / 100) * canvasHeight;

  ctx.save();
  ctx.translate(pixelX, pixelY);

  // Apply kite angle rotation + wind sway wobble
  const sway = Math.sin(time * 0.003 + (kite.x * 0.1)) * 0.1;
  ctx.rotate((kite.angle * Math.PI) / 180 + sway);

  // Scale based on status (e.g. victorious zooms slightly, falling rotates and shrinks)
  let scale = 1;
  if (kite.status === 'victorious') {
    scale = 1.25 + Math.sin(time * 0.01) * 0.05;
  } else if (kite.status === 'falling') {
    scale = Math.max(0.3, 1 - kite.fallProgress * 0.7);
    ctx.rotate(kite.fallAngle);
  } else if (kite.status === 'battling') {
    scale = 1.15;
  }
  ctx.scale(scale, scale);

  const size = kite.shape === 'pipao' ? 26 : kite.shape === 'peixinho' ? 18 : 22;

  // Draw Kite Skin according to shape & pattern
  drawKiteShape(ctx, kite.shape, kite.primaryColor, kite.secondaryColor, kite.pattern, size);

  // Draw Wooden Frame (Varetas)
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.8)'; // Bamboo / Wood color
  ctx.lineWidth = 1.5;
  drawKiteFrame(ctx, kite.shape, size);

  ctx.restore();

  // Draw Rabiola (Tail) if active
  if (kite.status !== 'falling' || kite.fallProgress < 0.8) {
    drawKiteTail(ctx, kite, pixelX, pixelY, size * scale, time);
  }

  // Draw String Line (Linha de Pipa)
  if (kite.status !== 'falling') {
    drawKiteLine(ctx, kite, pixelX, pixelY, canvasWidth, canvasHeight, time);
  }

  // Draw Nickname Tag and Rank/Crown Badge above kite
  drawKiteTag(ctx, kite, pixelX, pixelY, size * scale, canvasHeight);
}

function drawKiteShape(
  ctx: CanvasRenderingContext2D,
  shape: KiteShape,
  primary: string,
  secondary: string,
  pattern: KitePattern,
  size: number
) {
  ctx.beginPath();

  if (shape === 'diamante' || shape === 'pipao') {
    // Diamond shape
    const top = -size * 1.2;
    const bottom = size * 1.5;
    const left = -size;
    const right = size;

    ctx.moveTo(0, top);
    ctx.lineTo(right, 0);
    ctx.lineTo(0, bottom);
    ctx.lineTo(left, 0);
    ctx.closePath();
  } else if (shape === 'raia') {
    // Wider diamond, short profile
    const top = -size * 0.8;
    const bottom = size * 0.9;
    const left = -size * 1.3;
    const right = size * 1.3;

    ctx.moveTo(0, top);
    ctx.lineTo(right, 0);
    ctx.lineTo(0, bottom);
    ctx.lineTo(left, 0);
    ctx.closePath();
  } else if (shape === 'peixinho') {
    // Fish kite with sharp nose
    const top = -size * 1.4;
    const bottom = size * 1.1;
    const left = -size * 0.8;
    const right = size * 0.8;

    ctx.moveTo(0, top);
    ctx.lineTo(right, -size * 0.2);
    ctx.lineTo(0, bottom);
    ctx.lineTo(left, -size * 0.2);
    ctx.closePath();
  } else {
    // Brit (Octagon / Hexagon)
    const top = -size * 1.1;
    const bottom = size * 1.3;
    const left = -size * 1.1;
    const right = size * 1.1;

    ctx.moveTo(-size * 0.5, top);
    ctx.lineTo(size * 0.5, top);
    ctx.lineTo(right, 0);
    ctx.lineTo(size * 0.5, bottom);
    ctx.lineTo(-size * 0.5, bottom);
    ctx.lineTo(left, 0);
    ctx.closePath();
  }

  // Fill Pattern
  ctx.fillStyle = primary;
  ctx.fill();

  // Pattern overlay clip
  ctx.save();
  ctx.clip();

  if (pattern === 'brasil') {
    // Yellow Diamond inside
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(0, size * 0.7);
    ctx.lineTo(-size * 0.6, 0);
    ctx.closePath();
    ctx.fill();

    // Blue Circle
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  } else if (pattern === 'stripes' || pattern === 'flames') {
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.rect(-size * 1.5, -size * 1.5, size * 1.5, size * 3);
    ctx.fill();
  } else if (pattern === 'cross') {
    ctx.fillStyle = secondary;
    ctx.fillRect(-size * 0.2, -size * 1.5, size * 0.4, size * 3);
    ctx.fillRect(-size * 1.5, -size * 0.2, size * 3, size * 0.4);
  } else if (pattern === 'cyber' || pattern === 'cerol') {
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.moveTo(-size * 1.5, -size * 1.5);
    ctx.lineTo(size * 1.5, size * 1.5);
    ctx.lineTo(size * 1.5, -size * 1.5);
    ctx.closePath();
    ctx.fill();
  } else if (pattern === 'neon') {
    ctx.lineWidth = 4;
    ctx.strokeStyle = secondary;
    ctx.stroke();
  }

  ctx.restore();

  // Outer Border
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.stroke();
}

function drawKiteFrame(ctx: CanvasRenderingContext2D, shape: KiteShape, size: number) {
  ctx.beginPath();
  if (shape === 'raia') {
    ctx.moveTo(0, -size * 0.8);
    ctx.lineTo(0, size * 0.9);
    ctx.moveTo(-size * 1.3, 0);
    ctx.quadraticCurveTo(0, -size * 0.3, size * 1.3, 0);
  } else {
    ctx.moveTo(0, -size * 1.2);
    ctx.lineTo(0, size * 1.5);
    ctx.moveTo(-size, 0);
    ctx.quadraticCurveTo(0, -size * 0.4, size, 0);
  }
  ctx.stroke();
}

function drawKiteTail(
  ctx: CanvasRenderingContext2D,
  kite: KiteState,
  x: number,
  y: number,
  size: number,
  time: number
) {
  const tailLength = kite.shape === 'pipao' ? 12 : 8;
  const nodes = kite.tailNodes || [];

  if (nodes.length < 2) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.8);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    ctx.lineTo(node.x, node.y);
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw paper flags (fitas da rabiola) along the tail
  for (let i = 1; i < nodes.length; i += 2) {
    const n = nodes[i];
    const flagColor = i % 4 === 0 ? kite.primaryColor : kite.secondaryColor;

    ctx.save();
    ctx.translate(n.x, n.y);
    const flutter = Math.sin(time * 0.01 + i) * 0.4;
    ctx.rotate(flutter);

    ctx.fillStyle = flagColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawKiteLine(
  ctx: CanvasRenderingContext2D,
  kite: KiteState,
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number,
  time: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);

  // Line goes towards the bottom center of the screen
  const targetX = canvasWidth * 0.5 + (x - canvasWidth * 0.5) * 0.3;
  const targetY = canvasHeight + 20;

  // Tension sag curve (curva da linha)
  const tension = kite.status === 'battling' ? 5 : 25;
  const sagX = (x + targetX) / 2 + Math.sin(time * 0.002 + x) * tension;
  const sagY = (y + targetY) / 2 + tension;

  ctx.quadraticCurveTo(sagX, sagY, targetX, targetY);

  if (kite.lineType === 'chileana') {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // Red Chileana
    ctx.lineWidth = 1.8;
  } else if (kite.lineType === 'cerol_extra') {
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)'; // Gold Cerol
    ctx.lineWidth = 2.0;
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // White Linha 10
    ctx.lineWidth = 1.2;
  }

  ctx.stroke();
  ctx.restore();
}

function drawKiteTag(
  ctx: CanvasRenderingContext2D,
  kite: KiteState,
  x: number,
  y: number,
  size: number,
  canvasHeight: number
) {
  ctx.save();

  // Position tag above kite
  const tagY = y - size - 16;

  // Crown for Leader (#1)
  if (kite.crown || kite.rank === 1) {
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👑', x, tagY - 14);

    // Glow aura for #1 leader
    const gradient = ctx.createRadialGradient(x, tagY - 10, 2, x, tagY - 10, 25);
    gradient.addColorStop(0, 'rgba(250, 204, 21, 0.5)');
    gradient.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, tagY - 10, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rank emoji prefix
  let rankEmoji = '';
  if (kite.rank === 1) rankEmoji = '👑 ';
  else if (kite.rank === 2) rankEmoji = '🥈 ';
  else if (kite.rank === 3) rankEmoji = '🥉 ';

  // User indicator tag
  const isUser = kite.isUser;
  const nameText = `${rankEmoji}${kite.nickname}${isUser ? ' (VOCÊ)' : ''}`;

  ctx.font = isUser ? 'bold 12px "Outfit", sans-serif' : '11px "Plus Jakarta Sans", sans-serif';

  const textWidth = ctx.measureText(nameText).width;
  const paddingX = 8;
  const height = 20;

  // Tag Background
  ctx.fillStyle = isUser ? 'rgba(239, 68, 68, 0.95)' : 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = isUser ? '#fef08a' : 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = isUser ? 2 : 1;

  ctx.beginPath();
  ctx.roundRect(x - textWidth / 2 - paddingX, tagY - height / 2, textWidth + paddingX * 2, height, 10);
  ctx.fill();
  ctx.stroke();

  // Tag Text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(nameText, x, tagY);

  // Score pill below kite
  if (kite.score > 0 || kite.combo > 1) {
    const comboText = kite.combo > 1 ? `🔥 x${kite.combo} | ${kite.score} pts` : `⭐ ${kite.score} pts`;
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.fillText(comboText, x, y + size + 16);
  }

  ctx.restore();
}
