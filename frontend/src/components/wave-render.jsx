import React, { useEffect, useRef } from 'react';
import { getWeatherEffect } from '../utils/weather-effect.jsx';

const WeatherWaveDashboard = ({ weather = "clear", className }) => {
  const canvasRef = useRef(null);
  const currentSettingsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const lerp = (start, end, t) => start + (end - start) * t;

    // Initialize or update wave layers
    const initializeSettings = () => {
      const effect = getWeatherEffect(weather);
      currentSettingsRef.current = {
        layers: (effect.layers || []).map((layer, i) => ({
          ...layer,
          phase: Math.random() * Math.PI * 2,
          baseY: height / 2 + (i - 1) * 30,
        })),
        currentWaveColor: effect.waveColor || 'rgba(255,255,255,0.2)',
        weatherType: weather,
      };
    };

    if (!currentSettingsRef.current || currentSettingsRef.current.weatherType !== weather) {
      initializeSettings();
    }

    const drawWave = ({ baseY, amplitude, wavelength, phase, color }) => {
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

    const animate = () => {
      const current = currentSettingsRef.current;
      const targetSettings = getWeatherEffect(weather);

      // Smoothly lerp wave color
      const parseRGBA = (c) => {
        if (!c) return [255, 255, 255, 1];
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
        return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), m[4] ? parseFloat(m[4]) : 1] : [255,255,255,1];
      };

      const currentRGBA = parseRGBA(current.currentWaveColor);
      const targetRGBA = parseRGBA(targetSettings.waveColor || 'rgba(255,255,255,0.2)');
      const lerped = currentRGBA.map((v, i) => lerp(v, targetRGBA[i], 0.05));
      current.currentWaveColor = `rgba(${Math.round(lerped[0])},${Math.round(lerped[1])},${Math.round(lerped[2])},${lerped[3].toFixed(2)})`;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update layers
      const targetLayers = targetSettings.layers || [];
      while (current.layers.length < targetLayers.length) {
        const i = current.layers.length;
        current.layers.push({
          ...targetLayers[i],
          phase: Math.random() * Math.PI * 2,
          baseY: height / 2 + (i - 1) * 30
        });
      }
      if (current.layers.length > targetLayers.length) current.layers.splice(targetLayers.length);

      current.layers.forEach((layer, i) => {
        const target = targetLayers[i] || layer;
        layer.amplitude = lerp(layer.amplitude, target.amplitude, 0.02);
        layer.speed = lerp(layer.speed, target.speed, 0.02);
        layer.phase += layer.speed;
        drawWave({ ...layer, color: current.currentWaveColor });
      });

      requestAnimationFrame(animate);
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
    return () => window.removeEventListener('resize', handleResize);

  }, [weather]);

  return <canvas ref={canvasRef} className={className} style={{ pointerEvents: 'none' }} />;
};

export default WeatherWaveDashboard;
