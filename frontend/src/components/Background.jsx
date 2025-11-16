import React, { useEffect, useRef } from 'react';
import { getWeatherEffect } from '../utils/weather-effect.jsx';

const WeatherWaveDashboard = ({ weather = "clear" }) => {
  const canvasRef = useRef(null);
  const currentSettingsRef = useRef(null); // tracks all current state

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const nightColor = [10, 15, 50];
    const dayColor = [135, 206, 235];

    const lerp = (start, end, t) => start + (end - start) * t;
    const lerpColor = (c1, c2, t) => (c1 || [135,206,235]).map((v, i) => lerp(v, (c2 || [135,206,235])[i], t));
    const rgbToString = (rgb) => `rgb(${Math.round(rgb[0])},${Math.round(rgb[1])},${Math.round(rgb[2])})`;

    // Initialize currentSettingsRef if empty
    if (!currentSettingsRef.current) {
      const initialSettings = getWeatherEffect(weather) || {};
      currentSettingsRef.current = {
        bgColor: dayColor.slice(),
        particlesAlpha: initialSettings.particleColor ? 1 : 0,
        layers: (initialSettings.layers || []).map((layer, i) => ({ 
          ...layer, 
          phase: Math.random() * Math.PI * 2,
          baseY: height / 2 + (i - 1) * 30
        })),
        particles: [],
      };

      // Initialize particles
      if (initialSettings.particleColor) {
        for (let i = 0; i < 120; i++) {
          currentSettingsRef.current.particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vy: (initialSettings.particleSpeed?.[0] ?? 1) + Math.random() * ((initialSettings.particleSpeed?.[1] ?? 3) - (initialSettings.particleSpeed?.[0] ?? 1)),
            size: (initialSettings.particleSize?.[0] ?? 1) + Math.random() * ((initialSettings.particleSize?.[1] ?? 3) - (initialSettings.particleSize?.[0] ?? 1)),
          });
        }
      }
    }

    const getTimeGradient = () => {
      const hour = new Date().getHours();
      let t;
      if (hour >= 6 && hour <= 18) t = (hour - 6) / 12;
      else t = hour > 18 ? (hour - 18) / 12 : (hour + 6) / 12;
      return hour >= 6 && hour <= 18 ? t : 1 - t;
    };

    const drawSinWave = ({ baseY, amplitude, wavelength, phase, color }) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const y = baseY +
          amplitude * Math.sin((x / wavelength) * 2 * Math.PI + phase) +
          (amplitude / 4) * Math.sin((x / (wavelength / 2)) * 2 * Math.PI + phase * 1.5);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.stroke();
    };

    const drawParticles = (particles, particleColor, alpha) => {
      if (!particleColor || alpha <= 0) return;
      ctx.globalAlpha = alpha;
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
        p.y += p.vy;
        if (p.y > height) p.y = -p.size;
      });
      ctx.globalAlpha = 1;
    };

    let animationFrameId;
    let nextFlashTime = Date.now() + Math.random() * 5000 + 2000;

    const animate = () => {
      const targetSettings = getWeatherEffect(weather) || {};

      ctx.clearRect(0, 0, width, height);

      // --- Background interpolation ---
      const tTime = getTimeGradient();
      const currentBg = currentSettingsRef.current.bgColor || dayColor.slice();
      const targetBg = targetSettings.bgColor || dayColor;
      currentSettingsRef.current.bgColor = lerpColor(currentBg, targetBg, 0.02);
      const bg = lerpColor(nightColor, currentSettingsRef.current.bgColor, tTime);
      ctx.fillStyle = rgbToString(bg);
      ctx.fillRect(0, 0, width, height);

      // --- Layers interpolation ---
      const targetLayers = targetSettings.layers || [];

      // Match current layers to target
      while (currentSettingsRef.current.layers.length < targetLayers.length) {
        const i = currentSettingsRef.current.layers.length;
        currentSettingsRef.current.layers.push({
          ...targetLayers[i],
          phase: Math.random() * Math.PI * 2,
          baseY: height / 2 + (i - 1) * 30
        });
      }
      if (currentSettingsRef.current.layers.length > targetLayers.length) {
        currentSettingsRef.current.layers.splice(targetLayers.length);
      }

      // Interpolate layers
      currentSettingsRef.current.layers.forEach((layer, i) => {
        const targetLayer = targetLayers[i] || layer;
        layer.amplitude = lerp(layer.amplitude ?? 20, targetLayer.amplitude ?? 20, 0.02);
        layer.speed = lerp(layer.speed ?? 0.01, targetLayer.speed ?? 0.01, 0.02);
        layer.phase += layer.speed;
        drawSinWave({ ...layer, color: targetSettings.waveColor || '#ffffff' });
      });

      // --- Particle interpolation ---
      const targetAlpha = targetSettings.particleColor ? 1 : 0;
      currentSettingsRef.current.particlesAlpha = lerp(currentSettingsRef.current.particlesAlpha ?? 0, targetAlpha, 0.02);

      const desiredCount = targetSettings.particleColor ? 120 : 0;
      while (currentSettingsRef.current.particles.length < desiredCount) {
        currentSettingsRef.current.particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vy: (targetSettings.particleSpeed?.[0] ?? 1) + Math.random() * ((targetSettings.particleSpeed?.[1] ?? 3) - (targetSettings.particleSpeed?.[0] ?? 1)),
          size: (targetSettings.particleSize?.[0] ?? 1) + Math.random() * ((targetSettings.particleSize?.[1] ?? 3) - (targetSettings.particleSize?.[0] ?? 1)),
        });
      }
      if (currentSettingsRef.current.particles.length > desiredCount) {
        currentSettingsRef.current.particles.splice(0, currentSettingsRef.current.particles.length - desiredCount);
      }

      currentSettingsRef.current.particles.forEach(p => {
        const targetSpeed = (targetSettings.particleSpeed?.[0] ?? 1) + Math.random() * ((targetSettings.particleSpeed?.[1] ?? 3) - (targetSettings.particleSpeed?.[0] ?? 1));
        p.vy = lerp(p.vy ?? 1, targetSpeed, 0.02);
      });

      drawParticles(currentSettingsRef.current.particles, targetSettings.particleColor, currentSettingsRef.current.particlesAlpha);

      // --- Storm flashes ---
      if (weather?.toLowerCase() === 'storm') {
        const now = Date.now();
        if (now >= nextFlashTime) {
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(0, 0, width, height);
          nextFlashTime = now + Math.random() * 7000 + 9000;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      currentSettingsRef.current.layers.forEach((layer, i) => {
        layer.baseY = height / 2 + (i - 1) * 30;
      });
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
