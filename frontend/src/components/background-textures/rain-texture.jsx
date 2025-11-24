import React from "react";

export function RainTexture({
  lineColor = "rgba(255, 255, 255, 1)", // base color of streaks
  lineWidth = 2,                         // thickness of streaks
  streakCount = 80,                       // number of streaks
  direction = "top-left",                 // fixed direction
  minSpacing = 10,                        // minimum horizontal distance between streaks
  minLength = 30,
  maxLength = 70,
  slope = 0.2,                            // fixed slope for direction
}) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const lines = [];

  // Divide width into segments for guaranteed spacing
  const segmentWidth = Math.max(minSpacing, width / streakCount);

  for (let i = 0; i < streakCount; i++) {
    const x = i * segmentWidth + Math.random() * (segmentWidth - minSpacing);
    const y = Math.random() * height;
    const length = minLength + Math.random() * (maxLength - minLength);

    // Opacity slightly linked to length for depth
    const opacity = 0.1 + 0.25 * (length - minLength) / (maxLength - minLength);

    // Fixed direction
    const dx = direction === "top-left" ? -length * slope : length * slope;
    const dy = length;

    lines.push(
      <line
        key={i}
        x1={x}
        y1={y}
        x2={x + dx}
        y2={y + dy}
        stroke={lineColor.replace(/[\d.]+\)$/g, `${opacity})`)}
        strokeWidth={lineWidth}
        strokeLinecap="round"
      />
    );
  }

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
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        {lines}
      </svg>
    </div>
  );
}
