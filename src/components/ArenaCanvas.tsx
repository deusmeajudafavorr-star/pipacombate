import React, { useEffect, useRef } from 'react';
import { KiteState, BattleState } from '../types';
import { drawKiteOnCanvas } from '../utils/kites';

interface ArenaCanvasProps {
  kites: KiteState[];
  currentBattle: BattleState | null;
  windSpeed: number;
  onCanvasClick?: (x: number, y: number) => void;
}

interface Cloud {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export const ArenaCanvas: React.FC<ArenaCanvasProps> = ({
  kites,
  currentBattle,
  windSpeed,
  onCanvasClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cloudsRef = useRef<Cloud[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const clashSparksRef = useRef<{ x: number; y: number; vx: number; vy: number; color: string; life: number }[]>([]);

  useEffect(() => {
    const clouds: Cloud[] = [];
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * 800,
        y: 50 + Math.random() * 220,
        size: 30 + Math.random() * 38,
        speed: 0.2 + Math.random() * 0.35,
        opacity: 0.2 + Math.random() * 0.25,
      });
    }
    cloudsRef.current = clouds;

    const particles: Particle[] = [];
    for (let i = 0; i < 18; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: 0.5 + Math.random() * 1.4,
        vy: (Math.random() - 0.5) * 0.25,
        size: 1.2 + Math.random() * 1.6,
        opacity: 0.2 + Math.random() * 0.35,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const render = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#0f172a');
      skyGradient.addColorStop(0.3, '#1e3a8a');
      skyGradient.addColorStop(0.72, '#0284c7');
      skyGradient.addColorStop(1, '#38bdf8');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Nuvens
      ctx.fillStyle = '#ffffff';
      cloudsRef.current.forEach((cloud) => {
        cloud.x += cloud.speed * windSpeed;
        if (cloud.x > width + 100) cloud.x = -100;
        ctx.save();
        ctx.globalAlpha = cloud.opacity;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 1.2, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Partículas de vento
      particlesRef.current.forEach((p) => {
        p.x += p.vx * windSpeed;
        p.y += p.vy;
        if (p.x > width) p.x = 0;
        if (p.y > height || p.y < 0) p.y = Math.random() * height;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Montanhas distantes
      const farBase = height - 90;
      ctx.fillStyle = 'rgba(15, 40, 70, 0.55)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, farBase);
      ctx.lineTo(55, farBase - 75);
      ctx.lineTo(105, farBase - 20);
      ctx.lineTo(165, farBase - 105);
      ctx.lineTo(225, farBase - 35);
      ctx.lineTo(300, farBase - 125);
      ctx.lineTo(370, farBase - 30);
      ctx.lineTo(430, farBase - 90);
      ctx.lineTo(width, farBase - 5);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Montanhas em primeiro plano
      const nearBase = height - 35;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, nearBase);
      ctx.lineTo(45, nearBase - 52);
      ctx.lineTo(95, nearBase - 10);
      ctx.lineTo(150, nearBase - 76);
      ctx.lineTo(205, nearBase - 18);
      ctx.lineTo(260, nearBase - 58);
      ctx.lineTo(320, nearBase - 12);
      ctx.lineTo(380, nearBase - 70);
      ctx.lineTo(445, nearBase - 20);
      ctx.lineTo(width, nearBase - 42);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Pipás mais afastadas visualmente, sem alterar a física da batalha.
      const displayScaleX = 1.24;
      const displayScaleY = 1.12;
      const displayKite = (kite: KiteState): KiteState => ({
        ...kite,
        x: Math.max(6, Math.min(94, 50 + (kite.x - 50) * displayScaleX)),
        y: Math.max(8, Math.min(72, 40 + (kite.y - 40) * displayScaleY)),
      });

      kites.forEach((kite) => {
        drawKiteOnCanvas(ctx, displayKite(kite), width, height, time);
      });

      // Faíscas da batalha acompanham a nova posição visual.
      if (currentBattle && currentBattle.status === 'clashing') {
        const battleX = Math.max(6, Math.min(94, 50 + (currentBattle.x - 50) * displayScaleX));
        const battleY = Math.max(8, Math.min(72, 40 + (currentBattle.y - 40) * displayScaleY));
        const bx = (battleX / 100) * width;
        const by = (battleY / 100) * height;

        if (Math.random() < 0.6) {
          for (let i = 0; i < 3; i++) {
            clashSparksRef.current.push({
              x: bx,
              y: by,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              color: i % 2 === 0 ? '#facc15' : '#ef4444',
              life: 1,
            });
          }
        }

        clashSparksRef.current.forEach((spark) => {
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.life -= 0.05;
          if (spark.life > 0) {
            ctx.save();
            ctx.globalAlpha = spark.life;
            ctx.fillStyle = spark.color;
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, 2 + spark.life * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
        clashSparksRef.current = clashSparksRef.current.filter((s) => s.life > 0);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [kites, currentBattle, windSpeed]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !onCanvasClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    onCanvasClick(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={450}
        height={800}
        onClick={handleClick}
        className="w-full h-full object-cover cursor-pointer touch-none"
      />
    </div>
  );
};
