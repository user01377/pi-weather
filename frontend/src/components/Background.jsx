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
      initOffscreenCanvases();
    };
    window.addEventListener('resize', handleResize);

    // ----------------------------
    // Bokeh particles
    // ----------------------------
    const orbConfigs = [
      { count: 25, r: [20, 50], speed: 0.05, alpha: [0.05, 0.15] },
      { count: 40, r: [7, 22], speed: 0.1, alpha: [0.05, 0.2] },
      { count: 60, r: [1, 7], speed: 0.2, alpha: [0.03, 0.23] },
    ];

    const orbs = orbConfigs.flatMap(cfg =>
      Array.from({ length: cfg.count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * (cfg.r[1] - cfg.r[0]) + cfg.r[0],
        dx: (Math.random() - 0.5) * cfg.speed,
        dy: (Math.random() - 0.5) * cfg.speed,
        color: `rgba(180,220,255,${Math.random() * (cfg.alpha[1] - cfg.alpha[0]) + cfg.alpha[0]})`,
      }))
    );

    // Offscreen canvas for bokeh
    let bokehCanvas = document.createElement('canvas');
    let bokehCtx = bokehCanvas.getContext('2d');
    const initOffscreenCanvases = () => {
      bokehCanvas.width = width;
      bokehCanvas.height = height;

      // Pre-render orbs
      bokehCtx.clearRect(0, 0, width, height);
      orbs.forEach(o => {
        const orbGradient = bokehCtx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        orbGradient.addColorStop(0, o.color);
        orbGradient.addColorStop(1, 'rgba(200,230,255,0)');
        bokehCtx.fillStyle = orbGradient;
        bokehCtx.beginPath();
        bokehCtx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        bokehCtx.fill();
      });

      // Pre-render shimmer
      shimmerData.forEach(s => {
        s.width = width * 0.2;             // only as wide as the gradient
        s.canvas.width = s.width;
        s.canvas.height = height;
        const grad = s.canvasCtx.createLinearGradient(0, 0, s.width, height);
        grad.addColorStop(0, 'rgba(220,240,255,0)');
        grad.addColorStop(0.5, 'rgba(220,240,255,0.04)');
        grad.addColorStop(1, 'rgba(220,240,255,0)');
        s.canvasCtx.fillStyle = grad;
        s.canvasCtx.fillRect(0, 0, s.width, height);
      });
    };

    // ----------------------------
    // Shimmer streaks
    // ----------------------------
    const streaks = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 50 + 20,
      speed: Math.random() * 0.2 + 0.1,
      angle: Math.random() * Math.PI * 2,
      color: 'rgba(200,230,255,0.05)',
    }));

    let shimmerData = [
      { offset: -width, speed: 0.2, canvas: document.createElement('canvas'), canvasCtx: null, width: width * 0.2 },
      { offset: -width * 0.5, speed: 0.15, canvas: document.createElement('canvas'), canvasCtx: null, width: width * 0.2 },
    ];
    shimmerData.forEach(s => (s.canvasCtx = s.canvas.getContext('2d')));

    // ----------------------------
    // Noise overlay
    // ----------------------------
    const noiseCanvas = document.createElement('canvas');
    const noiseCtx = noiseCanvas.getContext('2d');
    noiseCanvas.width = noiseCanvas.height = 200;

    const generateNoise = () => {
      const imageData = noiseCtx.createImageData(200, 200);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = 230 + Math.random() * 25;
        data[i] = data[i + 1] = data[i + 2] = val;
        data[i + 3] = 5;
      }
      noiseCtx.putImageData(imageData, 0, 0);
    };
    generateNoise();
    const noisePattern = ctx.createPattern(noiseCanvas, 'repeat');

    let noiseOffsetX = 0;
    let noiseOffsetY = 0;

    initOffscreenCanvases();

    // ----------------------------
    // Animation loop
    // ----------------------------
    let animationFrameId;
    const animate = () => {
      // Background gradient
      const time = Date.now() * 0.0001;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `rgba(${50 + 50 * Math.sin(time)}, ${60 + 60 * Math.cos(time)}, 100, 1)`);
      gradient.addColorStop(1, 'rgba(10,20,50,1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw pre-rendered bokeh
      ctx.drawImage(bokehCanvas, 0, 0);

      // Draw streaks
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

      // Draw shimmers
      shimmerData.forEach(s => {
        ctx.drawImage(s.canvas, s.offset, 0);
        s.offset += s.speed;
        if (s.offset > width) s.offset = -s.width;
      });

      // Draw noise
      noiseOffsetX += 0.02;
      noiseOffsetY += 0.01;
      ctx.globalAlpha = 0.04;
      ctx.translate(noiseOffsetX % 200, noiseOffsetY % 200);
      ctx.fillStyle = noisePattern;
      ctx.fillRect(-noiseOffsetX % 200, -noiseOffsetY % 200, width + 200, height + 200);
      ctx.resetTransform();
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const canvasStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    display: 'block',
  };

  return <canvas ref={canvasRef} style={canvasStyle} />;
}
