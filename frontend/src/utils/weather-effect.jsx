export const getWeatherEffect = (weather) => {
  switch (weather?.toLowerCase()) {
    case 'clear':
      return {
        particleColor: null,
        particleSpeed: [0, 0],
        particleSize: [0, 0],
        waveColor: 'rgba(255, 255, 255, 0.2)', // subtle white waves
        bgColor: [125, 185, 209],              // bright daytime blue
        layers: [
          { amplitude: 15, wavelength: 300, speed: 0.0008 },
          { amplitude: 18, wavelength: 500, speed: 0.001 },
          { amplitude: 20, wavelength: 700, speed: 0.0012 },
        ],
      };

    case 'cloud':
      return {
        particleColor: null,
        particleSpeed: [0, 0],
        particleSize: [0, 0],
        waveColor: 'rgba(180, 180, 180, 0.25)', // muted gray waves
        bgColor: [140, 160, 180],              // soft gray-blue
        layers: [
          { amplitude: 25, wavelength: 320, speed: 0.0007 },
          { amplitude: 28, wavelength: 520, speed: 0.0009 },
          { amplitude: 30, wavelength: 720, speed: 0.001 },
        ],
      };

    case 'snow':
      return {
        particleColor: 'rgba(255,255,255,0.6)',
        particleSpeed: [0.5, 1.2],
        particleSize: [4, 6],
        waveColor: 'rgba(240, 240, 255, 0.1)', // icy, subtle waves
        bgColor: [200 * 0.85, 220 * 0.85, 255 * 0.85],
        layers: [
          { amplitude: 20, wavelength: 300, speed: 0.0005 },
          { amplitude: 22, wavelength: 500, speed: 0.0007 },
          { amplitude: 24, wavelength: 700, speed: 0.0009 },
        ],
      };

    case 'rain':
      return {
        particleColor: 'rgba(173,216,230,0.6)',
        particleSpeed: [2, 4],
        particleSize: [2, 2],
        waveColor: 'rgba(60, 60, 245, 0.1)',  // faint bluish waves
        bgColor: [90, 120, 160],               // darker, rainy sky
        layers: [
          { amplitude: 35, wavelength: 300, speed: 0.0025 },
          { amplitude: 45, wavelength: 500, speed: 0.002 },
          { amplitude: 55, wavelength: 700, speed: 0.0015 },
        ],
      };

    case 'storm':
      return {
        particleColor: 'rgba(255,255,255,0.45)',
        particleSpeed: [3, 6],
        particleSize: [3, 4],
        waveColor: 'rgba(120, 40, 160, 0.2)', // dramatic, dark purple waves
        bgColor: [40, 50, 90],                // stormy night blue
        layers: [
          { amplitude: 60, wavelength: 300, speed: 0.003 },
          { amplitude: 75, wavelength: 500, speed: 0.0032 },
          { amplitude: 90, wavelength: 700, speed: 0.0035 },
        ],
      };

    default:
      return {
        particleColor: null,
        particleSpeed: [0, 0],
        particleSize: [0, 0],
        waveColor: 'rgba(255,255,255,0.25)',
        bgColor: [125, 185, 209],             // fallback daytime blue
        layers: [
          { amplitude: 20, wavelength: 300, speed: 0.001 },
          { amplitude: 20, wavelength: 500, speed: 0.001 },
          { amplitude: 20, wavelength: 700, speed: 0.001 },
        ],
      };
  }
};
