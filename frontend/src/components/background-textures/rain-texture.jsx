import React from "react";

export function RainTexture({
  lineColor = "rgba(255, 255, 255, 0.2)", // base color of streaks
  lineWidth = 2,                         // thickness of streaks
  streakCount = 75,                       // number of streaks
  direction = "top-left",                 // "top-left" or "top-right"
  minSpacing = 10,                        // minimum horizontal distance between streaks
  minLength = 30,                         // minimum streak length
  maxLength = 70,                         // maximum streak length
}) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const lines = [];
  const usedX = [];

  for (let i = 0; i < streakCount; i++) {
    let x;
    let tries = 0;

    // Ensure minimum horizontal spacing
    do {
      x = Math.random() * width;
      tries++;
    } while (usedX.some(prevX => Math.abs(prevX - x) < minSpacing) && tries < 10);
    usedX.push(x);

    const y = Math.random() * height;

    // Randomize length and angle
    const length = minLength + Math.random() * (maxLength - minLength);
    const angleOffset = (Math.random() - 0.5) * 0.2; // subtle angle variation
    const dx = direction === "top-left" ? -length * (1 + angleOffset) : length * (1 + angleOffset);
    const dy = length;

    // Opacity slightly linked to length for depth
    const opacity = 0.05 + 0.25 * (length - minLength) / (maxLength - minLength);

    lines.push(
      <line
        key={i}
        x1={x}
        y1={y}
        x2={x + dx}
        y2={y + dy}
        stroke={`rgba(255,255,255,${opacity})`}
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
        zIndex: 0, // ensures it sits above wrapper but below UI
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {lines}
      </svg>
    </div>
  );
}
