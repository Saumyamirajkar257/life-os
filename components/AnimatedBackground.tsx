'use client';

import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: {
      x: number;
      y: number;
      ox: number; // original coordinates
      oy: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
    }[] = [];

    // Max 80 particles for low CPU / high performance
    const particleCount = Math.min(80, Math.floor((width * height) / 18000));
    
    // Aesthetic neon glowing colors driven by LIFE OS theme design
    const colors = [
      'rgba(99, 102, 241, 0.25)', // Indigo
      'rgba(168, 85, 247, 0.25)', // Purple
      'rgba(236, 72, 153, 0.22)', // Pink
      'rgba(255, 255, 255, 0.15)'  // White
    ];

    for (let i = 0; i < particleCount; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      particles.push({
        x: rx,
        y: ry,
        ox: rx,
        oy: ry,
        size: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY + scrollY; // adjust for scroll
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Initial mouse state centered
    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 2;
    mouseRef.current.tx = width / 2;
    mouseRef.current.ty = height / 2;

    const tick = () => {
      const mouse = mouseRef.current;
      // Interpolated easing for smooth fluid motion
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Incremental drifting velocity
        p.ox += p.vx;
        p.oy += p.vy;

        // Apply proximity warping based on mouse coordinates
        const dx = mouse.x - p.ox;
        const dy = mouse.y - p.oy;
        const dist = Math.hypot(dx, dy);
        
        let warpX = 0;
        let warpY = 0;
        const limitDist = 180;
        
        if (dist < limitDist) {
          const force = (limitDist - dist) / limitDist;
          // Smooth repulsion pushes light particles away from cursor
          warpX = -dx * force * 0.15;
          warpY = -dy * force * 0.15;
        }

        p.x = p.ox + warpX;
        p.y = p.oy + warpY;

        // Boundary looping checks
        if (p.ox < 0) p.ox = width;
        if (p.ox > width) p.ox = 0;
        if (p.oy < 0) p.oy = height;
        if (p.oy > height) p.oy = 0;

        // Render point of light
        ctx.beginPath();
        ctx.arc(p.x, p.y - scrollY * 0.15, p.size, 0, Math.PI * 2); // subtle parallax
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size > 1.5 ? 4 : 0;
        ctx.shadowColor = p.color;
        ctx.fill();

        // Constellation effect (increase line rendering between nearby particles)
        particles.forEach((p2) => {
          const cdx = p.x - p2.x;
          const cdy = (p.y - scrollY * 0.15) - (p2.y - scrollY * 0.15);
          const cdist = Math.hypot(cdx, cdy);
          if (cdist > 0 && cdist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - scrollY * 0.15);
            ctx.lineTo(p2.x, p2.y - scrollY * 0.15);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 - cdist / 666})`;
            ctx.stroke();
          }
        });
      });

      // Clear shadows for next frame speed
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none parallax-layer">
      {/* Animated Aurora Background Layer */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background: 'linear-gradient(-45deg, #4f46e5, #9333ea, #db2777, #4f46e5)',
          backgroundSize: '400% 400%',
          animation: 'aurora 15s ease infinite',
          filter: 'blur(100px)'
        }}
      />

      {/* Low-CPU Canvas Particle Generator */}
      <canvas ref={canvasRef} className="absolute inset-0 block opacity-80" />

      {/* Dot Grid Layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          opacity: 0.05,
        }}
      />

      {/* Floating Ambient Glowing Orbs */}
      <div
        className="absolute rounded-full will-change-transform"
        style={{
          width: '50vw',
          height: '50vw',
          top: '-15%',
          left: '-15%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
          animation: 'orbFloat1 20s ease-in-out infinite',
          opacity: 0.8,
        }}
      />

      <div
        className="absolute rounded-full will-change-transform hidden md:block"
        style={{
          width: '45vw',
          height: '45vw',
          top: '-10%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.04) 0%, transparent 70%)',
          animation: 'orbFloat2 15s ease-in-out infinite',
          animationDelay: '-4s',
          opacity: 0.7,
        }}
      />

      <div
        className="absolute rounded-full will-change-transform"
        style={{
          width: '40vw',
          height: '40vw',
          bottom: '-12%',
          right: '5%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)',
          animation: 'orbFloat3 12s ease-in-out infinite',
          animationDelay: '-2s',
          opacity: 0.8,
        }}
      />

      {/* Edge Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <style jsx>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(45px, 25px) scale(1.05); }
          66% { transform: translate(-25px, 40px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.06); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, -20px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}
