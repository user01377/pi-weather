import React, { useEffect, useRef } from 'react';
import { getWeatherEffect } from '../utils/weather-effect.jsx';

const WeatherWaveDashboard = ({ weather = "clear" }) => { // = "clear" for redunancy in case icon fails
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const nightColor = [10, 15, 50];
    const dayColor = [135, 206, 235];

    const lerpColor = (color1, color2, t) =>
      color1.map((c, i) => c + (color2[i] - c) * t);
    const rgbToString = (rgb) =>
      `rgb(${Math.round(rgb[0])},${Math.round(rgb[1])},${Math.round(rgb[2])})`;

    // Get weather settings
    const settings = getWeatherEffect(weather);

    // Initialize wave layers
    const layers = settings.layers.map((layer, i) => ({
      ...layer,
      baseY: height / 2 + (i - 1) * 30, // subtle vertical offset for depth
      phase: 0,
      color: settings.waveColor,
    }));

    // Initialize particles
    let particles = [];
    const particleCount = 120;

    const initParticles = () => {
      particles = [];
      if (!settings.particleColor) return;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vy:
            settings.particleSpeed[0] +
            Math.random() * (settings.particleSpeed[1] - settings.particleSpeed[0]),
          size:
            settings.particleSize[0] +
            Math.random() * (settings.particleSize[1] - settings.particleSize[0]),
        });
      }
    };

    initParticles();

    const drawSinWave = ({ baseY, amplitude, wavelength, phase, color }) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const y =
          baseY +
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

    const drawParticles = () => {
      if (!settings.particleColor) return;
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = settings.particleColor;
        ctx.fill();
        p.y += p.vy;
        if (p.y > height) p.y = -p.size;
      });
    };

    const getTimeGradient = () => {
      const hour = new Date().getHours();
      let t;
      if (hour >= 6 && hour <= 18) t = (hour - 6) / 12;
      else t = hour > 18 ? (hour - 18) / 12 : (hour + 6) / 12;
      return hour >= 6 && hour <= 18 ? t : 1 - t;
    };

    let animationFrameId;
    let nextFlashTime = Date.now() + Math.random() * 5000 + 2000; // initial storm flash

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background gradient
      const t = getTimeGradient();
      ctx.fillStyle = rgbToString(lerpColor(nightColor, dayColor, t));
      ctx.fillRect(0, 0, width, height);

      // Draw wave layers
      layers.forEach(layer => {
        layer.phase += layer.speed;
        const amplitudeOffset = Math.sin(Date.now() * 0.0001 + layer.phase) * 0.1;
        drawSinWave({ ...layer, amplitude: layer.amplitude + amplitudeOffset });
      });

      // Draw particles
      drawParticles();

      // Storm lightning flashes
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
      layers.forEach((layer, i) => (layer.baseY = height / 2 + (i - 1) * 30));
      initParticles();
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