import React, { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Resize shimmer canvases
      shimmerData.forEach(s => {
        s.canvas.width = s.width;
        s.canvas.height = height;
      });
    };
    window.addEventListener('resize', handleResize);

    // ----------------------------
    // Orb configuration
    // ----------------------------
    const orbConfigs = [
      {
        count: 50,
        r: [2, 6],
        speed: 0.5,
        alpha: [0.1, 0.5],
        colors: [
          'rgba(255,200,200,ALPHA)',
          'rgba(200,255,220,ALPHA)',
          'rgba(200,220,255,ALPHA)'
        ]
      },
      {
        count: 40,
        r: [15, 27],
        speed: 0.2,
        alpha: [0.05, 0.3],
        colors: [
          'rgba(255,255,200,ALPHA)',
          'rgba(200,255,255,ALPHA)'
        ]
      },
      {
        count: 30,
        r: [30, 50],
        speed: 0.12,
        alpha: [0.05, 0.3],
        colors: [
          'rgba(255,255,200,ALPHA)',
          'rgba(200,255,255,ALPHA)'
        ]
      }
    ];

    // ----------------------------
    // Bokeh particles
    // ----------------------------
    const orbs = orbConfigs.flatMap(cfg =>
      Array.from({ length: cfg.count }, () => {
        const baseR = Math.random() * (cfg.r[1] - cfg.r[0]) + cfg.r[0];
        const colorTemplate = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
        const match = colorTemplate.match(/rgba\((\d+),(\d+),(\d+),ALPHA\)/);
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          dx: (Math.random() - 0.5) * cfg.speed,
          dy: (Math.random() - 0.5) * cfg.speed,
          baseR,
          r: baseR,
          rgb: { r, g, b },
          alphaRange: cfg.alpha,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02
        };
      })
    );

    // ----------------------------
    // Streaks
    // ----------------------------
    const streaks = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 50 + 20,
      speed: Math.random() * 0.2 + 0.1,
      angle: Math.random() * Math.PI * 2,
      color: 'rgba(200,230,255,0.05)',
    }));

    // ----------------------------
    // Shimmers
    // ----------------------------
    const shimmerData = [
      { offset: -width, speed: 0.2, canvas: document.createElement('canvas'), canvasCtx: null, width: width * 0.2 },
      { offset: -width * 0.5, speed: 0.15, canvas: document.createElement('canvas'), canvasCtx: null, width: width * 0.2 },
    ];
    shimmerData.forEach(s => {
      const grad = ctx.createLinearGradient(s.offset, 0, s.offset + 100, 0);
      grad.addColorStop(0, 'rgba(220,240,255,0)');
      grad.addColorStop(0.5, 'rgba(220,240,255,0.04)');
      grad.addColorStop(1, 'rgba(220,240,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(s.offset, 0, 100, height);
    
      s.offset += s.speed;
      if (s.offset > width) s.offset = -100;
    });

    // ----------------------------
    // Animation loop
    // ----------------------------
    let animationFrameId;
    const animate = () => {
      const time = Date.now() * 0.0001;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `rgba(${50 + 50 * Math.sin(time)}, ${60 + 60 * Math.cos(time)}, 100, 1)`);
      gradient.addColorStop(1, 'rgba(10,20,50,1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // --- Bokeh ---
      orbs.forEach(o => {
        o.x += o.dx; o.y += o.dy;
        if (o.x > width) o.x = 0;
        if (o.x < 0) o.x = width;
        if (o.y > height) o.y = 0;
        if (o.y < 0) o.y = height;

        o.pulsePhase += o.pulseSpeed;
        const alpha = o.alphaRange[0] + ((o.alphaRange[1] - o.alphaRange[0]) / 2) + ((o.alphaRange[1] - o.alphaRange[0]) / 2) * Math.sin(o.pulsePhase);

        const centerColor = `rgba(${o.rgb.r},${o.rgb.g},${o.rgb.b},${alpha.toFixed(3)})`;
        const outerColor = `rgba(${o.rgb.r},${o.rgb.g},${o.rgb.b},0.3)`;

        const orbGradient = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        orbGradient.addColorStop(0, centerColor);
        orbGradient.addColorStop(0.7, outerColor);
        orbGradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Streaks ---
      streaks.forEach(s => {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(s.length, 0);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        if (s.x > width) s.x = 0;
        if (s.x < 0) s.x = width;
        if (s.y > height) s.y = 0;
        if (s.y < 0) s.y = height;
      });

      // --- Shimmers ---
      shimmerData.forEach(s => {
        ctx.drawImage(s.canvas, s.offset, 0);
        s.offset += s.speed;
        if (s.offset > width) s.offset = -s.width;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    display: 'block',
  }} />;
}
