export const getWeatherEffect = (weather) => {
  switch (weather?.toLowerCase()) {
    case 'clear':
      return {
        waveColor: 'rgba(255, 255, 255, 0.2)', // subtle white waves
        bgColor: [125, 185, 209],              // bright daytime blue
      };

    case 'cloud':
      return {
        waveColor: 'rgba(180, 180, 180, 0.25)', // muted gray waves
        bgColor: [140, 160, 180],              // soft gray-blue
      };

    case 'snow':
      return {
        waveColor: 'rgba(255, 250, 250, 0.3)', // icy, subtle waves
        bgColor: [150, 180, 230],
      };

    case 'rain':
      return {
        waveColor: 'rgba(60, 60, 245, 0.2)',  // faint bluish waves
        bgColor: [90, 120, 160],               // darker, rainy sky
      };

    case 'storm':
      return {
        waveColor: 'rgba(120, 40, 160, 0.23)', // dramatic, dark purple waves
        bgColor: [40, 50, 90],                // stormy night blue
      };

    default:
      return {
        waveColor: 'rgba(255,255,255,0.25)',
        bgColor: [125, 185, 209],             // fallback daytime blue
      };
  }
};
