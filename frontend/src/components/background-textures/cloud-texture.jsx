import React from "react";

// Simple deterministic pseudo-random function
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate smooth sine-wave-based cloud path
function generateCloudPath({ width = 1440, height = 320, amplitude = 40, peaks = 12, seed = 0 }) {
  const points = [];
  const segment = width / peaks;
  const baseY = height / 2;

  for (let i = 0; i <= peaks; i++) {
    const x = i * segment;
    const variation = (seededRandom(seed + i) - 0.5) * amplitude * 0.5;
    const y = baseY + Math.sin((i / peaks) * Math.PI) * amplitude + variation;
    points.push({ x, y });
  }

  let d = `M0,${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = prev.x + (curr.x - prev.x) / 2;
    const cpY = prev.y + (curr.y - prev.y) / 2;
    d += ` C${cpX},${cpY} ${cpX},${cpY} ${curr.x},${curr.y}`;
  }

  d += ` L${width},${height} L0,${height} Z`;
  return d;
}

export function CloudTexture({
  type = "sct",
  isNight = false,
}) {
  // Cloud configuration
  const cloudConfigs = {
    few: { layers: 2, amplitude: 25, peaks: 9, baseOpacity: 0.15, heightFactor: 0.45 },
    sct: { layers: 2, amplitude: 30, peaks: 12, baseOpacity: 0.23, heightFactor: 0.5 },
    bkn: { layers: 3, amplitude: 35, peaks: 12, baseOpacity: 0.14, heightFactor: 0.5 },
    ovc: { layers: 4, amplitude: 40, peaks: 14, baseOpacity: 0.257, heightFactor: 0.57 },
  };

  // Night opacity overrides
  const nightOpacityOverrides = {
    few: 0.05,
    sct: 0.09,
    bkn: 0.1,
    ovc: 0.09,
  };

  // Normalize type to match keys
  const normalizedType = (type || "sct").toLowerCase();

  // Pick config
  const config = cloudConfigs[normalizedType] || cloudConfigs["sct"];

  // Determine base opacity for day/night
  const baseOpacity = isNight ? nightOpacityOverrides[normalizedType] : config.baseOpacity;

  // Heights for each layer
  const layerHeights = Array.from({ length: config.layers }, (_, i) => {
    const maxHeight = config.heightFactor * 100;
    return ((i + 1) / config.layers) * maxHeight;
  });

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {layerHeights.map((height, i) => {
        const amplitude = config.amplitude * (0.8 + i * 0.1);
        const peaks = Math.max(config.peaks + i, 6);
        const opacity = baseOpacity * (1 - i * 0.15); // layered opacity
        const seed = i * 100; // deterministic seed per layer
        const path = generateCloudPath({ width: 1440, height: 320, amplitude, peaks, seed });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${height}%`,
              overflow: "hidden",
            }}
          >
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                transform: "rotate(180deg) scaleX(-1)",
              }}
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path fill={`rgba(255, 255, 255, ${opacity})`} d={path} />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
