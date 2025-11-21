import { getWeatherEffect } from '../utils/weather-effect';

/**
 * Updates CSS variables for dynamic background
 * @param {string} weather - Weather keyword ('clear', 'cloud', etc.)
 */
export const updateBackground = (weather) => {
  const wrapper = document.querySelector('.background-wrapper');
  if (!wrapper) return;

  const effect = getWeatherEffect(weather);

  // Apply background color for day
  const dayRGB = effect.bgColor.join(',');
  wrapper.style.setProperty('--bg-day', `rgb(${dayRGB})`);

  // Optional: night color is static, or could be calculated
  wrapper.style.setProperty('--bg-night', `rgb(10, 15, 50)`);

  // Wave color for sine wave canvas
  wrapper.style.setProperty('--wave-color', effect.waveColor);

  // Update CSS gradient
  wrapper.style.background = `linear-gradient(var(--bg-night), var(--bg-day))`;
};
