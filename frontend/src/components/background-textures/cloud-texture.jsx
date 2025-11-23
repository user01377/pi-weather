import React from "react";

export function CloudTexture({
  type,
  waveColor = "rgba(255, 255, 255, 0.2)",
}) {

  const cloudType = type || "sct";

  // Cloud type configuration
  const cloudConfigs = {
    few: { layers: 1, amplitude: 25, peaks: 12, opacity: 0.15 },
    sct: { layers: 2, amplitude: 35, peaks: 14, opacity: 0.18 },
    bkn: { layers: 3, amplitude: 45, peaks: 16, opacity: 0.22 },
    ovc: { layers: 4, amplitude: 60, peaks: 18, opacity: 0.28 },
  };

  const config = cloudConfigs[cloudType] || cloudConfigs["sct"];

  // Generate smooth wavy path
  const generatePath = (width = 1440, height = 320, amplitude = 40, peaks = 12) => {
    const segment = width / peaks;
    const points = [];

    // Generate y-values for each peak
    for (let i = 0; i <= peaks; i++) {
      const x = i * segment;
      const baseY = height / 2;
      const y = baseY + (Math.random() - 0.5) * amplitude;
      points.push({ x, y });
    }

    // Build smooth cubic path
    let d = `M0,${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = prev.x + (curr.x - prev.x) / 2;
      const cpY = prev.y + (curr.y - prev.y) / 2;
      d += ` C${cpX},${cpY} ${cpX},${cpY} ${curr.x},${curr.y}`;
    }

    // Close path to bottom
    d += ` L${width},${height} L0,${height} Z`;
    return d;
  };

  // Calculate heights for each layer (inner layers smaller, outer layers taller)
  const layerHeights = Array.from({ length: config.layers }, (_, i) =>
    ((i + 1) / config.layers) * 60
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {layerHeights.map((height, i) => {
        const amplitude = config.amplitude + i * 10; // outer layers bigger
        const peaks = Math.max(config.peaks - i, 6); // fewer peaks for outer layers
        const opacity = config.opacity * (1 - i * 0.25);
        const path = generatePath(1440, 320, amplitude, peaks);

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
                transform: "rotate(180deg) scaleX(-1)", // radiate from top-left
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
