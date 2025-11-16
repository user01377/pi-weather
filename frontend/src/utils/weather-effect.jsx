export const getWeatherEffect = (weather) => {
  switch (weather?.toLowerCase()) {
    case 'rain':
      return {
        particleColor: 'rgba(173,216,230,0.3)', // light blue drops
        particleSpeed: [2, 4],
        particleSize: [2, 2],
        waveColor: 'rgba(100,100,255,0.4)',
        layers: [
          { amplitude: 23, wavelength: 315, speed: 0.002 },
          { amplitude: 45, wavelength: 500, speed: 0.0015 },
          { amplitude: 62, wavelength: 700, speed: 0.001 },
        ],
      };

    case 'snow':
      return {
        particleColor: 'rgba(255,255,255,0.6)', // white snowflakes
        particleSpeed: [0.5, 1.5],
        particleSize: [4, 6],
        waveColor: 'rgba(255,255,255,0.35)',
        layers: [
          { amplitude: 18, wavelength: 300, speed: 0.002 },
          { amplitude: 33, wavelength: 500, speed: 0.0015 },
          { amplitude: 64, wavelength: 700, speed: 0.001 },
        ],
      };

    case 'cloud':
      return {
        particleColor: null,
        particleSpeed: [0, 0],
        particleSize: [0, 0],
        waveColor: 'rgba(200,200,200,0.7)',
        layers: [
          { amplitude: 25, wavelength: 600, speed: 0.0012 }, // subtle faster first layer
          { amplitude: 40, wavelength: 500, speed: 0.0009 }, // middle layer gentle drift
          { amplitude: 65, wavelength: 750, speed: 0.0007 }, // slow large background wave
        ],
      };

    case 'storm':
      return {
        particleColor: 'rgba(255,255,255,0.45)', // rain-like but heavier
        particleSpeed: [3, 6],
        particleSize: [3, 4],
        waveColor: 'rgba(152,143,1661,0.45)', // darker, more ominous waves
        layers: [
          { amplitude: 50, wavelength: 400, speed: 0.003 },
          { amplitude: 70, wavelength: 600, speed: 0.002 },
          { amplitude: 90, wavelength: 800, speed: 0.0015 },
        ],
      };

    case 'clear':
      default:
        return {
          particleColor: null,
          particleSpeed: [0, 0],
          particleSize: [0, 0],
          waveColor: 'rgba(255,255,255,0.2)',
          layers: [
            { amplitude: 22, wavelength: 313, speed: 0.0012 },
            { amplitude: 39, wavelength: 544, speed: 0.0009 },
            { amplitude: 62, wavelength: 786, speed: 0.0007 },
          ],
        };
  }
};
