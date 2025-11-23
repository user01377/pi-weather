import React from "react";

export function CloudTexture({
  type,
  waveColor = "rgba(255, 255, 255, 0.2)",
}) {
  const cloudType = type || "sct";

  // Cloud type configuration
  const cloudConfigs = {
    few: { layers: 2, amplitude: 27, peaks: 9, baseOpacity: 0.19, heightFactor: 0.45 },
    sct: { layers: 2, amplitude: 35, peaks: 12, baseOpacity: 0.18, heightFactor: 0.55 },
    bkn: { layers: 3, amplitude: 45, peaks: 14, baseOpacity: 0.14, heightFactor: 0.65 },
    ovc: { layers: 4, amplitude: 60, peaks: 16, baseOpacity: 0.18, heightFactor: 0.6 },
  };


  console.log("cloudType", cloudType)
  const config = cloudConfigs[cloudType] || cloudConfigs["sct"];

  const generatePath = (width = 1440, height = 320, amplitude = 40, peaks = 12, offsetY = 0) => {
    const segment = width / peaks;
    const points = [];
    const baseY = height / 2 + offsetY;
    let lastY = baseY + (Math.random() - 0.5) * amplitude;
    points.push({ x: 0, y: lastY });

    for (let i = 1; i <= peaks; i++) {
      const x = i * segment;
      const delta = (Math.random() - 0.5) * (amplitude / 2);
      const y = lastY + delta;
      points.push({ x, y });
      lastY = y;
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
  };

  // Calculate heights and opacities per layer
  const layerHeights = Array.from({ length: config.layers }, (_, i) => {
    const factor = config.heightFactor; // max fraction of container
    const step = (factor * 100) / config.layers;
    return step * (i + 1);
  });

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {layerHeights.map((height, i) => {
        const amplitude = config.amplitude * (0.8 + i * 0.2);
        const peaks = Math.max(config.peaks + i, 6);
        const opacity = config.baseOpacity * (1 - i * 0.2); // inner layers more opaque
        const offsetY = (Math.random() - 0.5) * 15;
        const path = generatePath(1440, 320, amplitude, peaks, offsetY);

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
              <path fill={waveColor.replace("0.2", opacity.toString())} d={path} />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
