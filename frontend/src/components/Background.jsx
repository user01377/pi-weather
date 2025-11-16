import React, { useEffect, useRef } from 'react';
import { getWeatherEffect } from '../utils/weather-effect.jsx';

const WeatherWaveDashboard = ({ weather = "clear", sunrise, sunset }) => {
  const canvasRef = useRef(null);
  const currentSettingsRef = useRef(null); // tracks current animation state

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const nightColor = [10, 15, 50];
    const dayColor = [125, 185, 209];

    const lerp = (start, end, t) => start + (end - start) * t;
    const lerpColor = (c1, c2, t) => c1.map((v, i) => lerp(v, c2[i], t));
    const rgbToString = (rgb) => `rgb(${Math.round(rgb[0])},${Math.round(rgb[1])},${Math.round(rgb[2])})`;

    const parseColor = (c) => {
      if (!c) return [255, 255, 255, 1];
      const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
      return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), m[4] !== undefined ? parseFloat(m[4]) : 1] : [255, 255, 255, 1];
    };

    // Initialize current settings if not set
    if (!currentSettingsRef.current) {
      const initialSettings = getWeatherEffect(weather);
      currentSettingsRef.current = {
        bgColor: dayColor.slice(),
        particlesAlpha: initialSettings.particleColor ? 1 : 0,
        layers: (initialSettings.layers || []).map((layer, i) => ({
          ...layer,
          phase: Math.random() * Math.PI * 2,
          baseY: height / 2 + (i - 1) * 30
        })),
        particles: [],
        currentWaveColor: initialSettings.waveColor || '#ffffff',
        weatherType: weather,
      };

      if (initialSettings.particleColor) {
        for (let i = 0; i < 120; i++) {
          currentSettingsRef.current.particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vy: initialSettings.particleSpeed[0] + Math.random() * (initialSettings.particleSpeed[1] - initialSettings.particleSpeed[0]),
            size: initialSettings.particleSize[0] + Math.random() * (initialSettings.particleSize[1] - initialSettings.particleSize[0]),
          });
        }
      }
    }

    const parseTimeString = (timeStr) => {
      if (!timeStr) return null;
    
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
    
      if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    // --- New: gradient based on sunrise/sunset ---
    const getTimeGradientFromSun = (sunriseStr, sunsetStr) => {
      const sunriseDate = parseTimeString(sunriseStr);
      const sunsetDate = parseTimeString(sunsetStr);
      if (!sunriseDate || !sunsetDate) return 1; // fallback to day
    
      const now = new Date();
    
      const fadeMinutes = 90; // duration of sunset/sunrise fade in minutes
      const fadeMs = fadeMinutes * 60 * 1000;
    
      // --- Sunrise fade ---
      const sunriseFadeEnd = new Date(sunriseDate.getTime() + fadeMs);
      if (now >= sunriseDate && now <= sunriseFadeEnd) {
        return (now - sunriseDate) / fadeMs; // 0 → 1 during fade
      }
    
      // --- Daytime ---
      if (now > sunriseFadeEnd && now < sunsetDate) {
        return 1; // fully day
      }
    
      // --- Sunset fade ---
      const sunsetFadeStart = new Date(sunsetDate.getTime() - fadeMs);
      if (now >= sunsetFadeStart && now <= sunsetDate) {
        return 1 - (now - sunsetFadeStart) / fadeMs; // 1 → 0 during fade
      }
    
      // --- Night ---
      return 0; // fully night
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
      ctx.shadowBlur = 2;
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
      const current = currentSettingsRef.current;

      // --- Reset particles if weather changed ---
      if (current.weatherType !== weather) {
        current.particles = [];
        current.weatherType = weather;
        if (targetSettings.particleColor) {
          for (let i = 0; i < 120; i++) {
            current.particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vy: targetSettings.particleSpeed[0] + Math.random() * (targetSettings.particleSpeed[1] - targetSettings.particleSpeed[0]),
              size: targetSettings.particleSize[0] + Math.random() * (targetSettings.particleSize[1] - targetSettings.particleSize[0]),
            });
          }
        }
      }

      ctx.clearRect(0, 0, width, height);

      // --- Background with sunrise/sunset gradient ---
      const tTime = getTimeGradientFromSun(sunrise, sunset);
      current.bgColor = lerpColor(current.bgColor, targetSettings.bgColor || dayColor, 0.02);
      const bg = lerpColor(nightColor, current.bgColor, tTime);
      ctx.fillStyle = rgbToString(bg);
      ctx.fillRect(0, 0, width, height);

      // --- Wave color interpolation ---
      const targetWaveRGB = parseColor(targetSettings.waveColor || '#ffffff');
      const currentWaveRGB = parseColor(current.currentWaveColor);
      const lerpedWave = currentWaveRGB.map((v, i) => lerp(v, targetWaveRGB[i], 0.05));
      current.currentWaveColor = `rgba(${Math.round(lerpedWave[0])},${Math.round(lerpedWave[1])},${Math.round(lerpedWave[2])},${lerpedWave[3].toFixed(2)})`;
      

      // --- Wave layers ---
      const targetLayers = targetSettings.layers || [];
      while (current.layers.length < targetLayers.length) {
        const i = current.layers.length;
        current.layers.push({
          ...targetLayers[i],
          phase: Math.random() * Math.PI * 2,
          baseY: height / 2 + (i - 1) * 30
        });
      }
      if (current.layers.length > targetLayers.length) {
        current.layers.splice(targetLayers.length);
      }

      current.layers.forEach((layer, i) => {
        const targetLayer = targetLayers[i] || layer;
        layer.amplitude = lerp(layer.amplitude, targetLayer.amplitude, 0.02);
        layer.speed = lerp(layer.speed, targetLayer.speed, 0.02);
        layer.phase += layer.speed;
        drawSinWave({ ...layer, color: current.currentWaveColor });
      });

      // --- Particles ---
      current.particlesAlpha = lerp(current.particlesAlpha, targetSettings.particleColor ? 1 : 0, 0.02);
      current.particles.forEach(p => {
        const targetVy = targetSettings.particleSpeed[0] + Math.random() * (targetSettings.particleSpeed[1] - targetSettings.particleSpeed[0]);
        p.vy = lerp(p.vy, targetVy, 0.02);
        const targetSize = targetSettings.particleSize[0] + Math.random() * (targetSettings.particleSize[1] - targetSettings.particleSize[0]);
        p.size = lerp(p.size, targetSize, 0.02);
      });
      drawParticles(current.particles, targetSettings.particleColor, current.particlesAlpha);

      // --- Storm flashes ---
      if (weather.toLowerCase() === 'storm') {
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
  }, [weather, sunrise, sunset]); // added sunrise/sunset to deps

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default WeatherWaveDashboard;
