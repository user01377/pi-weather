import { getWeatherEffect } from '../utils/weather-values';

export const updateBackground = (weather, isNight) => {
  const wrapper = document.querySelector('.background-wrapper');
  if (!wrapper) return;

  const effect = getWeatherEffect(weather);

  // console.log("Weather:", weather);
  // console.log("Is night?", isNight);
  // console.log("Effect:", effect);

  let baseColor;
  
  if (!isNight && weather === 'snow') {
    // Force an icy daytime color for snow
    baseColor = 'rgb(105, 135, 185)';
  } else {
    baseColor = isNight
      ? 'rgb(25, 20, 55)'
      : `rgb(${effect.bgColor.join(',')})`;
  }

  wrapper.style.setProperty('--bg-base', baseColor);
};