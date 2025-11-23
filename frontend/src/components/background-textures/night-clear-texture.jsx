import React from "react";

export function GlassTexture({
  dotCount = 200,            // number of random dots
  minDotSize = 1,
  maxDotSize = 3,
  dotColor = "rgba(255,255,255,0.06)",
  noiseOpacity = 0.03,       // opacity of the noise overlay
  style = {},
}) {
  // Generate random dot positions
  const dots = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < dotCount; i++) {
      arr.push({
        cx: Math.random() * 100,  // percentages to scale with width
        cy: Math.random() * 100,
        r: minDotSize + Math.random() * (maxDotSize - minDotSize),
      });
    }
    return arr;
  }, [dotCount, minDotSize, maxDotSize]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Dots layer */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={`${dot.cx}%`}
            cy={`${dot.cy}%`}
            r={dot.r}
            fill={dotColor}
          />
        ))}
      </svg>

      {/* Noise layer */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: noiseOpacity,
        }}
      >
        <defs>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" fill="white" />
      </svg>
    </div>
  );
}
