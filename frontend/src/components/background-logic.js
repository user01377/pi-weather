import { getWeatherEffect } from '../utils/weather-effect';

export const updateBackground = (weather) => {
  const wrapper = document.querySelector('.background-wrapper');
  if (!wrapper) return;

  const effect = getWeatherEffect(weather);

  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 18;

  // DAY COLOR: effect.bgColor (your weather base)
  // NIGHT COLOR: static or auto
  const baseColor = isNight
    ? 'rgb(10, 15, 50)'
    : `rgb(${effect.bgColor.join(',')})`;

  // Apply base color
  wrapper.style.setProperty('--bg-base', baseColor);

  // Weather tint (must be valid rgba)
  // Example: "rgba(255, 255, 255, 0.15)"
  wrapper.style.setProperty('--bg-weather', effect.waveColor);
};
