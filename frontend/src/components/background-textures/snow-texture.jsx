import React from "react";

export function SnowTexture({
  snowColor = "rgba(255, 250, 250, 0.82)",
  snowCount = 120,
  minDistance = 4, // minimum distance between snowflakes
}) {
  const layers = [
    { count: Math.floor(snowCount * 0.4), sizeRange: [0.4, 0.8], opacityRange: [0.25, 0.5], rotationVariance: 15 },
    { count: Math.floor(snowCount * 0.35), sizeRange: [0.6, 1.2], opacityRange: [0.4, 0.75], rotationVariance: 30 },
    { count: Math.floor(snowCount * 0.25), sizeRange: [1.0, 1.6], opacityRange: [0.6, 0.95], rotationVariance: 45 },
  ];

  const placed = [];

  const generatePosition = () => {
    let attempts = 0;
    while (attempts < 50) {
      const pos = { x: Math.random() * 100, y: Math.random() * 100 };
      if (!placed.some(p => {
        const dx = p.x - pos.x;
        const dy = p.y - pos.y;
        return Math.sqrt(dx*dx + dy*dy) < minDistance;
      })) {
        placed.push(pos);
        return pos;
      }
      attempts++;
    }
    const pos = { x: Math.random() * 100, y: Math.random() * 100 };
    placed.push(pos);
    return pos;
  };

  const randomSize = (min, max) => min + Math.random() * (max - min);
  const randomOpacity = (size, min, max) =>
    Math.min(max, min + (size / max) * (max - min) * (0.8 + Math.random() * 0.4));
  const randomRotation = (variance = 360) => Math.random() * variance;

  const polygonPoints = (cx, cy, r, sides = 8, rotation = 0) => {
    const points = [];
    const angleStep = (2 * Math.PI) / (sides * 2);
    const rad = (deg) => (deg * Math.PI) / 180;
    for (let i = 0; i < sides * 2; i++) {
      const angle = i * angleStep + rad(rotation);
      const radius = i % 2 === 0 ? r : r * (0.82 + Math.random() * 0.08);
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin slice">
        {layers.map((layer, li) =>
          Array.from({ length: layer.count }).map((_, i) => {
            const { x, y } = generatePosition();
            const size = randomSize(...layer.sizeRange);
            const opacity = randomOpacity(size, ...layer.opacityRange);
            const rotation = randomRotation(layer.rotationVariance);

            return (
              <polygon
                key={`${li}-${i}`}
                points={polygonPoints(x, y, size, 8, rotation)}
                fill={snowColor}
                fillOpacity={opacity}
              />
            );
          })
        )}

        {/* Optional subtle halo polygon flakes */}
        {Array.from({ length: 8 }).map((_, i) => {
          const { x, y } = generatePosition();
          const size = randomSize(1.2, 2);
          const rotation = randomRotation();
          return (
            <polygon
              key={`halo-${i}`}
              points={polygonPoints(x, y, size, 8, rotation)}
              fill={snowColor}
              fillOpacity={0.05 + Math.random() * 0.05}
            />
          );
        })}
      </svg>
    </div>
  );
}
