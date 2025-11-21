import React, { useEffect, useRef } from 'react';
import { getWeatherEffect } from '../utils/weather-effect.jsx';

const WeatherWaveDashboard = ({ weather = "clear" }) => {
  const canvasRef = useRef(null);
  const currentSettingsRef = useRef(null); // tracks current wave state

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const lerp = (start, end, t) => start + (end - start) * t;

    const parseColor = (c) => {
      if (!c) return [255, 255, 255, 1];
      const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
      return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), m[4] !== undefined ? parseFloat(m[4]) : 1] : [255, 255, 255, 1];
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

    // Initialize wave layers
    if (!currentSettingsRef.current) {
      const initialSettings = getWeatherEffect(weather);
      currentSettingsRef.current = {
        layers: (initialSettings.layers || []).map((layer, i) => ({
          ...layer,
          phase: Math.random() * Math.PI * 2,
          baseY: height / 2 + (i - 1) * 30
        })),
        currentWaveColor: initialSettings.waveColor || '#ffffff',
        weatherType: weather,
      };
    }

    const animate = () => {
      const current = currentSettingsRef.current;
      const targetSettings = getWeatherEffect(weather) || {};

      // Update wave color
      const targetWaveRGB = parseColor(targetSettings.waveColor || '#ffffff');
      const currentWaveRGB = parseColor(current.currentWaveColor);
      const lerpedWave = currentWaveRGB.map((v, i) => lerp(v, targetWaveRGB[i], 0.05));
      current.currentWaveColor = `rgba(${Math.round(lerpedWave[0])},${Math.round(lerpedWave[1])},${Math.round(lerpedWave[2])},${lerpedWave[3].toFixed(2)})`;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update wave layers
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
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [weather]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default WeatherWaveDashboard;
