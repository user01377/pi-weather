export const updateDayNightBackground = (isNight) => {
  const wrapper = document.querySelector('.background-wrapper');
  if (!wrapper) return;

  const dayColor = 'rgb(98,193,229)';   // daytime base
  const nightColor = 'rgb(10, 15, 50)'; // nighttime base

  const targetColor = isNight ? nightColor : dayColor;
  wrapper.style.setProperty('--bg-base', targetColor);
};

export const updateWeatherOverlay = (weatherWord) => {
  const wrapper = document.querySelector('.background-wrapper');
  if (!wrapper) return;

  // Map weather words to overlay colors
  const weatherMap = {
    clear: 'rgba(0,0,0,0)',
    snow: 'rgba(255,255,255,0.1)',
    rain: 'rgba(0,0,0,0.2)',
    thunder: 'rgba(50,0,0,0.2)',
    cloudy: 'rgba(0,0,0,0.05)',
  };

  const overlayColor = weatherMap[weatherWord] ?? 'rgba(0,0,0,0)';
  wrapper.style.setProperty('--bg-weather', overlayColor);
};
