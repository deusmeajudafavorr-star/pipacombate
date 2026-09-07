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

  // Scale based on status. Entering kites grow smoothly from small to normal size.
  let scale = 1;
  let entryAlpha = 1;
  if (kite.status === 'entering') {
    const progress = Math.max(0, Math.min(1, kite.entryProgress));
    const eased = 1 - Math.pow(1 - progress, 3);
    scale = 0.55 + eased * 0.45;
    entryAlpha = 0.35 + eased * 0.65;
  } else if (kite.status === 'victorious') {
    scale = 1.25 + Math.sin(time * 0.01) * 0.05;
  } else if (kite.status === 'falling') {
    scale = Math.max(0.3, 1 - kite.fallProgress * 0.7);
    ctx.rotate(kite.fallAngle);
  } else if (kite.status === 'battling') {
    scale = 1.15;
  }
  ctx.globalAlpha = entryAlpha;
  ctx.scale(scale, scale);

  const size = kite.shape === 'pipao' ? 26 : kite.shape === 'peixinho' ? 18 : 22;

  // Small entry glow/ring to make each new kite visibly announce its arrival.
  if (kite.status === 'entering') {
    const pulse = 0.7 + Math.sin(time * 0.02) * 0.2;
    ctx.save();
    ctx.globalAlpha = (1 - Math.min(kite.entryProgress, 1)) * 0.55 * pulse;
    ctx.strokeStyle = kite.primaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size * (1.7 - Math.min(kite.entryProgress, 1) * 0.5), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

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

  ctx.strokeStyle = kite.status === 'battling' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = kite.status === 'battling' ? 1.5 : 0.8;
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
  const label = `@${kite.nickname}`;
  const rankLabel = kite.rank ? `#${kite.rank}` : '';

  ctx.save();
  ctx.font = 'bold 10px Arial';
  const textWidth = ctx.measureText(label).width;
  const tagY = Math.max(18, y - size - 8);

  ctx.fillStyle = kite.isUser ? 'rgba(16, 185, 129, 0.9)' : 'rgba(15, 23, 42, 0.82)';
  ctx.beginPath();
  ctx.roundRect(x - textWidth / 2 - 5, tagY - 10, textWidth + 10, 15, 6);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, tagY - 2);

  if (kite.crown || rankLabel) {
    ctx.font = 'bold 9px Arial';
    ctx.fillStyle = kite.crown ? '#facc15' : '#cbd5e1';
    ctx.fillText(`${kite.crown ? '👑 ' : ''}${rankLabel}`, x, tagY - 14);
  }

  ctx.restore();
}
