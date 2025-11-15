// utils.js (or utils.jsx)
export function degreesToCardinal16(deg) {
    const directions16 = [
      'N','NNE','NE','ENE','E','ESE','SE','SSE',
      'S','SSW','SW','WSW','W','WNW','NW','NNW'
    ];
  
    const index16 = Math.round(deg / 22.5) % 16;
    return directions16[index16];
  }
  