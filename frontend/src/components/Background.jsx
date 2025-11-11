import React, { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // --- Orb configurations ---
    const orbConfigs = [
      { count: 90, r: [2, 6], speed: 0.2, alpha: [0.1, 0.5], colors: ['rgba(255,200,200,ALPHA)','rgba(200,255,220,ALPHA)','rgba(200,220,255,ALPHA)'] },
      { count: 11, r: [15, 27], speed: 0.25, alpha: [0.05, 0.3], colors: ['rgba(255,255,200,ALPHA)','rgba(200,255,255,ALPHA)'] },
      { count: 9, r: [30, 50], speed: 0.5, alpha: [0.05, 0.3], colors: ['rgba(255,255,200,ALPHA)','rgba(200,255,255,ALPHA)'] }
    ];

    // --- Create orbs ---
    const orbs = orbConfigs.flatMap(cfg => 
      Array.from({ length: cfg.count }, () => {
        const baseR = Math.random() * (cfg.r[1] - cfg.r[0]) + cfg.r[0];
        const colorTemplate = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
        const [r, g, b] = colorTemplate.match(/\d+/g).map(Number);

        let preCanvas = null, scale = 1;

        if (baseR <= 10) {
          scale = 3;
          preCanvas = document.createElement('canvas');
          preCanvas.width = preCanvas.height = baseR * 2 * scale;
          const preCtx = preCanvas.getContext('2d');
          const grad = preCtx.createRadialGradient(baseR*scale, baseR*scale, 0, baseR*scale, baseR*scale, baseR*scale);
          grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
          grad.addColorStop(0.7, `rgba(${r},${g},${b},0.3)`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          preCtx.fillStyle = grad;
          preCtx.beginPath();
          preCtx.arc(baseR*scale, baseR*scale, baseR*scale, 0, Math.PI*2);
          preCtx.fill();
        }

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          dx: (Math.random() - 0.5) * cfg.speed,
          dy: (Math.random() - 0.5) * cfg.speed,
          r: baseR,
          rgb: { r, g, b },
          alphaRange: cfg.alpha,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
          canvas: preCanvas,
          scale,
          liveDraw: baseR > 10
        };
      })
    );

    // --- Streaks ---
    const streaks = Array.from({ length: 20 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 50 + 20,
      speed: Math.random() * 0.2 + 0.1,
      angle: Math.random() * Math.PI * 2,
      color: 'rgba(200,230,255,0.05)',
    }));

    // --- Shimmers ---
    const shimmerData = [
      { offset: -width, speed: 0.2, width: width * 0.2 },
      { offset: -width * 0.5, speed: 0.15, width: width * 0.2 },
    ].map(s => {
      const c = document.createElement('canvas');
      c.width = s.width;
      c.height = height;
      const cCtx = c.getContext('2d');
      const grad = cCtx.createLinearGradient(0, 0, s.width, height);
      grad.addColorStop(0, 'rgba(220,240,255,0)');
      grad.addColorStop(0.5, 'rgba(220,240,255,0.04)');
      grad.addColorStop(1, 'rgba(220,240,255,0)');
      cCtx.fillStyle = grad;
      cCtx.fillRect(0,0,s.width,height);
      return { ...s, canvas: c };
    });

// --- Animation ---
let frameId;
const fps = 30; // limit FPS here
const interval = 1000 / fps;
let lastTime = Date.now();

const animate = () => {
  const now = Date.now();
  const delta = now - lastTime;

  if (delta >= interval) {
    lastTime = now - (delta % interval); // adjust for drift

    const t = Date.now() * 0.00021;

    // Background gradient
    const gradient = ctx.createLinearGradient(-width*0.2, -height*0.2, width*1.2, height*1.2);
    const r = 50 + 30*Math.sin(t) + 20*Math.sin(t*0.3);
    const g = 60 + 30*Math.cos(t*1.2) + 15*Math.sin(t*0.5);
    const b = 80 + 20*Math.sin(t*0.7) + 20*Math.cos(t*0.4);
    gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
    gradient.addColorStop(1, 'rgba(10,20,50,1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,width,height);

    // Draw orbs
    orbs.forEach(o => {
      o.x = (o.x + o.dx + width) % width;
      o.y = (o.y + o.dy + height) % height;

      o.pulsePhase += o.pulseSpeed;
      const alpha = o.alphaRange[0] + (o.alphaRange[1]-o.alphaRange[0])/2 + (o.alphaRange[1]-o.alphaRange[0])/2*Math.sin(o.pulsePhase);
      ctx.globalAlpha = alpha;

      if (o.liveDraw) {
        const g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);
        g.addColorStop(0, `rgba(${o.rgb.r},${o.rgb.g},${o.rgb.b},1)`);
        g.addColorStop(0.7, `rgba(${o.rgb.r},${o.rgb.g},${o.rgb.b},0.3)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x,o.y,o.r,0,Math.PI*2);
        ctx.fill();
      } else {
        ctx.drawImage(o.canvas, o.x - o.r*o.scale, o.y - o.r*o.scale);
      }

      ctx.globalAlpha = 1;
    });

    // Draw streaks
    streaks.forEach(s => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(s.length,0);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      s.x = (s.x + Math.cos(s.angle)*s.speed + width) % width;
      s.y = (s.y + Math.sin(s.angle)*s.speed + height) % height;
    });

    // Draw shimmers
    shimmerData.forEach(s => {
      ctx.drawImage(s.canvas, s.offset, 0);
      s.offset += s.speed;
      if(s.offset > width) s.offset = -s.width;
    });
  }

  frameId = requestAnimationFrame(animate);
};
    animate();

    // --- Resize handler ---
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      shimmerData.forEach(s => s.canvas.height = height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:-1, display:'block' }} />;
}
