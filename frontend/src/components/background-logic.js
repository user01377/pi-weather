import { getWeatherEffect } from '../utils/weather-effect';
import { parseTimeToDate } from '../utils/parseAPI-time'

export const updateBackground = (weather, sunriseStr, sunsetStr) => {
  const wrapper = document.querySelector('.background-wrapper');
  if (!wrapper) return;

  const effect = getWeatherEffect(weather);

  const now = new Date();
  const sunriseDate = parseTimeToDate(sunriseStr);
  const sunsetDate  = parseTimeToDate(sunsetStr);

  const isNight = now < sunriseDate || now >= sunsetDate;

  // console.log("Weather:", weather);
  // console.log("Sunrise:", sunriseStr, "=>", sunriseDate);
  // console.log("Sunset:", sunsetStr, "=>", sunsetDate);
  // console.log("Is night?", isNight);
  // console.log("Effect:", effect);

  const baseColor = isNight
    ? 'rgb(10, 15, 50)'
    : `rgb(${effect.bgColor.join(',')})`;

  wrapper.style.setProperty('--bg-base', baseColor);
  wrapper.style.setProperty('--bg-weather', effect.waveColor);
};

