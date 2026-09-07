import React, { useEffect, useRef } from 'react';
import { KiteState, BattleState } from '../types';
import { drawKiteOnCanvas } from '../utils/kites';

interface ArenaCanvasProps {
  kites: KiteState[];
  currentBattle: BattleState | null;
  windSpeed: number; // multiplier
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

  // Initialize background clouds & wind particles
  useEffect(() => {
    const clouds: Cloud[] = [];
    for (let i = 0; i < 6; i++) {
      clouds.push({
        x: Math.random() * 800,
        y: 40 + Math.random() * 250,
        size: 35 + Math.random() * 45,
        speed: 0.2 + Math.random() * 0.4,
        opacity: 0.25 + Math.random() * 0.35,
      });
    }
    cloudsRef.current = clouds;

    const particles: Particle[] = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: 0.5 + Math.random() * 1.5,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1.5 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Main 60 FPS Canvas Render Loop
  useEffect(() => {
    let animationFrameId: number;

    const render = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear & Draw Animated Sky Gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#0f172a'); // Dark slate top
      skyGradient.addColorStop(0.3, '#1e3a8a'); // Deep navy
      skyGradient.addColorStop(0.7, '#0284c7'); // Bright sky blue
      skyGradient.addColorStop(1, '#38bdf8'); // Horizon sky
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Moving Clouds
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

      // 3. Draw Wind Particles
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

      // 4. Draw Horizon Silhouettes (City & Trees at the bottom)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      // Small roof & tree skyline
      ctx.lineTo(0, height - 35);
      ctx.lineTo(40, height - 35);
      ctx.lineTo(50, height - 55);
      ctx.lineTo(60, height - 35);
      ctx.lineTo(120, height - 35);
      ctx.lineTo(135, height - 65);
      ctx.lineTo(160, height - 35);
      ctx.lineTo(240, height - 35);
      ctx.lineTo(260, height - 50);
      ctx.lineTo(310, height - 35);
      ctx.lineTo(width, height - 35);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // 5. Draw Active Kites
      kites.forEach((kite) => {
        drawKiteOnCanvas(ctx, kite, width, height, time);
      });

      // 6. Draw Clash Sparks during active battle
      if (currentBattle && currentBattle.status === 'clashing') {
        const bx = (currentBattle.x / 100) * width;
        const by = (currentBattle.y / 100) * height;

        // Spawn new sparks
        if (Math.random() < 0.6) {
          for (let i = 0; i < 3; i++) {
            clashSparksRef.current.push({
              x: bx,
              y: by,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              color: i % 2 === 0 ? '#facc15' : '#ef4444',
              life: 1.0,
            });
          }
        }

        // Draw and update sparks
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

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [kites, currentBattle, windSpeed]);

  // Canvas Click / Tap Handler (Spawns Likes / Interactive Hearts)
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !onCanvasClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onCanvasClick(x, y);
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
