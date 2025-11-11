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
    };
    window.addEventListener('resize', handleResize);

    // ----------------------------
    // Bokeh particles
    // ----------------------------
    const orbs = [];
    for (let i = 0; i < 25; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 30 + 20,
        dx: (Math.random() - 0.5) * 0.05,
        dy: (Math.random() - 0.5) * 0.05,
        color: `rgba(180,220,255,${Math.random() * 0.1 + 0.05})`,
      });
    }
    for (let i = 0; i < 40; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 15 + 7,
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
        color: `rgba(200,230,255,${Math.random() * 0.15 + 0.05})`,
      });
    }
    for (let i = 0; i < 60; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 6 + 1,
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2,
        color: `rgba(220,240,255,${Math.random() * 0.2 + 0.03})`,
      });
    }

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

    let shimmerOffset1 = -width;
    let shimmerOffset2 = -width * 0.5;
    const shimmerSpeed1 = 0.2;
    const shimmerSpeed2 = 0.15;

    // ----------------------------
    // Noise overlay
    // ----------------------------
    const noiseCanvas = document.createElement('canvas');
    const noiseCtx = noiseCanvas.getContext('2d');
    noiseCanvas.width = 200;
    noiseCanvas.height = 200;

    const generateNoise = () => {
      const imageData = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const val = 230 + Math.random() * 25; // light frost
        imageData.data[i] = val;
        imageData.data[i + 1] = val;
        imageData.data[i + 2] = val;
        imageData.data[i + 3] = 5; // very subtle alpha
      }
      noiseCtx.putImageData(imageData, 0, 0);
    };
    generateNoise();

    let noiseOffsetX = 0;
    let noiseOffsetY = 0;

    // ----------------------------
    // Animation loop
    // ----------------------------
    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Gradient background (icy blue → dark blue)
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const time = Date.now() * 0.0001;
      gradient.addColorStop(0, `rgba(${50 + 50 * Math.sin(time)}, ${60 + 60 * Math.cos(time)}, 100, 1)`);
      gradient.addColorStop(1, 'rgba(10,20,50,1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw bokeh
      orbs.forEach(o => {
        const orbGradient = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        orbGradient.addColorStop(0, o.color);
        orbGradient.addColorStop(1, 'rgba(200,230,255,0)');
        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();

        o.x += o.dx;
        o.y += o.dy;
        if (o.x > width) o.x = 0;
        if (o.x < 0) o.x = width;
        if (o.y > height) o.y = 0;
        if (o.y < 0) o.y = height;
      });

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
      [[shimmerOffset1, shimmerSpeed1], [shimmerOffset2, shimmerSpeed2]].forEach(([offset, speed], i) => {
        const shimmerWidth = width * 0.2;
        const shimmerGradient = ctx.createLinearGradient(offset, 0, offset + shimmerWidth, height);
        shimmerGradient.addColorStop(0, 'rgba(220,240,255,0)');
        shimmerGradient.addColorStop(0.5, 'rgba(220,240,255,0.04)');
        shimmerGradient.addColorStop(1, 'rgba(220,240,255,0)');
        ctx.fillStyle = shimmerGradient;
        ctx.fillRect(0, 0, width, height);

        if (i === 0) shimmerOffset1 += speed;
        else shimmerOffset2 += speed;

        if (shimmerOffset1 > width) shimmerOffset1 = -shimmerWidth;
        if (shimmerOffset2 > width) shimmerOffset2 = -shimmerWidth;
      });

      // Draw animated noise
      noiseOffsetX += 0.02;
      noiseOffsetY += 0.01;
      ctx.globalAlpha = 0.04; // very subtle
      ctx.drawImage(noiseCanvas, noiseOffsetX % 200, noiseOffsetY % 200, width, height);
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
    display: 'block'
  };

  return <canvas ref={canvasRef} style={canvasStyle} />;
}
