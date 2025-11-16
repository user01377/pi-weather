import React, { useEffect, useRef } from 'react';

const WeatherWaveDashboard = ({ weather = 'snow' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // --- Day/Night Gradient ---
    let gradientProgress = 0;
    const gradientSpeed = 0.00002; // slow day/night loop
    const nightColor = [10, 15, 50];
    const dayColor = [135, 206, 235];

    const lerpColor = (color1, color2, t) => color1.map((c, i) => c + (color2[i] - c) * t);
    const rgbToString = (rgb) => `rgb(${Math.round(rgb[0])},${Math.round(rgb[1])},${Math.round(rgb[2])})`;

    // --- Layered Sine Waves ---
    const layers = [
      { baseY: height / 2, amplitude: 20, wavelength: 300, speed: 0.002, phase: 0, color: 'rgba(255,255,255,0.2)' },
      { baseY: height / 2 + 30, amplitude: 40, wavelength: 500, speed: 0.0015, phase: 0, color: 'rgba(255,255,255,0.15)' },
      { baseY: height / 2 - 20, amplitude: 60, wavelength: 800, speed: 0.001, phase: 0, color: 'rgba(255,255,255,0.1)' },
    ];

    // --- Particles for rain/snow ---
    const particles = [];
    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: weather === 'rain' ? 2 + Math.random() * 2 : 0.5 + Math.random(),
        size: weather === 'rain' ? 2 : 4 + Math.random() * 2,
      });
    }

    // --- Draw a smooth sine wave with gradient effect ---
    const drawSinWave = ({ baseY, amplitude, wavelength, phase, color }) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        // Combine a secondary sine for natural motion
        const y = baseY + amplitude * Math.sin((x / wavelength) * 2 * Math.PI + phase)
                        + (amplitude / 4) * Math.sin((x / (wavelength / 2)) * 2 * Math.PI + phase * 1.5);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.stroke();
    };

    const drawParticles = () => {
      ctx.fillStyle = weather === 'rain' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)';
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.vy;
        if (p.y > height) p.y = -p.size;
      });
    };

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update gradient
      gradientProgress += gradientSpeed;
      if (gradientProgress > 1) gradientProgress = 0;
      const bgColor = rgbToString(lerpColor(nightColor, dayColor, gradientProgress));
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Animate sine waves with amplitude drift
      layers.forEach(layer => {
        layer.phase += layer.speed;
        // Slowly vary amplitude for organic motion
        layer.amplitude += Math.sin(Date.now() * 0.0001 + layer.phase) * 0.1;
        drawSinWave(layer);
      });

      // Draw weather particles
      if (weather === 'rain' || weather === 'snow') drawParticles();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      layers.forEach((layer, i) => layer.baseY = height / 2 + (i - 1) * 30);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [weather]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default WeatherWaveDashboard;
