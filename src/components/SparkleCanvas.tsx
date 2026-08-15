/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  wiggleSpeed: number;
  wiggleRange: number;
  type: 'star' | 'heart' | 'gold_dust';
  rotation: number;
  rotationSpeed: number;
}

interface SparkleCanvasProps {
  active: boolean;
  intensity?: 'soft' | 'rich' | 'celebration';
}

export default function SparkleCanvas({ active, intensity = 'soft' }: SparkleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    resizeCanvas();

    const createParticle = (isInitial = false): Particle => {
      const typeRand = Math.random();
      let type: 'star' | 'heart' | 'gold_dust' = 'gold_dust';
      if (typeRand > 0.85) {
        type = 'heart';
      } else if (typeRand > 0.6) {
        type = 'star';
      }

      const sizeBase = type === 'heart' ? Math.random() * 8 + 6 : type === 'star' ? Math.random() * 6 + 4 : Math.random() * 3 + 1;

      return {
        x: Math.random() * canvas.width,
        y: isInitial ? Math.random() * canvas.height : canvas.height + 20,
        size: sizeBase,
        speedY: -(Math.random() * 1.2 + 0.4),
        speedX: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.7 + 0.3,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        wiggleSpeed: Math.random() * 0.02 + 0.005,
        wiggleRange: Math.random() * 2 + 1,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      };
    };

    // Initialize particles
    const maxParticles = intensity === 'celebration' ? 120 : intensity === 'rich' ? 80 : 40;
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    // Helper to draw a heart
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, rotation: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.beginPath();
      c.moveTo(0, 0);
      // Left side of heart
      c.bezierCurveTo(-size / 2, -size / 2, -size, -size / 6, -size, size / 3);
      c.bezierCurveTo(-size, size * 0.8, -size * 0.2, size * 1.2, 0, size * 1.5);
      // Right side of heart
      c.bezierCurveTo(size * 0.2, size * 1.2, size, size * 0.8, size, size / 3);
      c.bezierCurveTo(size, -size / 6, size / 2, -size / 2, 0, 0);
      c.closePath();
      
      // Metallic Gold Gradient
      const grad = c.createLinearGradient(-size, -size, size, size);
      grad.addColorStop(0, `rgba(212, 175, 55, ${opacity})`);       // Gold
      grad.addColorStop(0.5, `rgba(247, 237, 211, ${opacity * 0.95})`); // Light Gold
      grad.addColorStop(1, `rgba(184, 147, 39, ${opacity * 0.8})`);    // Warm Gold
      
      c.fillStyle = grad;
      c.fill();
      c.restore();
    };

    // Helper to draw a star
    const drawStar = (c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, rotation: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.beginPath();
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size / 2.5;
      let rot = (Math.PI / 2) * 3;
      let px = 0;
      let py = 0;
      const step = Math.PI / spikes;

      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        px = Math.cos(rot) * r;
        py = Math.sin(rot) * r;
        if (i === 0) {
          c.moveTo(px, py);
        } else {
          c.lineTo(px, py);
        }
        rot += step;
      }
      c.closePath();

      const grad = c.createRadialGradient(0, 0, 0, 0, 0, size);
      grad.addColorStop(0, `rgba(255, 253, 247, ${opacity})`);
      grad.addColorStop(0.3, `rgba(247, 237, 211, ${opacity * 0.8})`);
      grad.addColorStop(1, `rgba(212, 175, 55, 0)`);

      c.fillStyle = grad;
      c.fill();
      c.restore();
    };

    // Draw gold dust particle
    const drawDust = (c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      c.beginPath();
      c.arc(x, y, size, 0, Math.PI * 2);
      c.fillStyle = `rgba(212, 175, 55, ${opacity * 0.85})`;
      c.shadowColor = 'rgba(212, 175, 55, 0.4)';
      c.shadowBlur = size * 2;
      c.fill();
      c.shadowBlur = 0; // reset
    };

    const animate = (time: number) => {
      if (!active) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        // Move particle
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * p.wiggleSpeed) * (p.wiggleRange * 0.05);
        p.rotation += p.rotationSpeed;

        // Draw particle based on type
        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.opacity, p.rotation);
        } else if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size, p.opacity, p.rotation);
        } else {
          drawDust(ctx, p.x, p.y, p.size, p.opacity);
        }

        // Recycle if offscreen or faded
        if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particles[idx] = createParticle();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [active, intensity]);

  return (
    <canvas
      id="sparkle-canvas"
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
