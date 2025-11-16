export function degreesToCardinal16(deg) {
  const directions16 = [
    'N','NNE','NE','ENE','E','ESE','SE','SSE',
    'S','SSW','SW','WSW','W','WNW','NW','NNW'
  ];

  // Normalize degree to 0–360
  deg = deg % 360;
  if (deg < 0) deg += 360;

  // Each sector is 22.5°, shift by half a sector (11.25°)
  const index16 = Math.floor((deg + 11.25) / 22.5) % 16;

  return directions16[index16];
}
