import React from "react";

export function StormTexture({
  lineWidth = 3,          // thicker streaks
  streakCount = 60,       // number of streaks
  direction = "top-left", // fixed direction
  minSpacing = 20,        // minimum horizontal spacing
  minLength = 50,
  maxLength = 100,
  slope = 1,              // fixed slope for direction
}) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const lines = [];

  // Divide width into segments for guaranteed spacing
  const segmentWidth = Math.max(minSpacing, width / streakCount);

  for (let i = 0; i < streakCount; i++) {
    // Pick a random X within the segment
    const x = i * segmentWidth + Math.random() * (segmentWidth - minSpacing);

    const y = Math.random() * height;
    const length = minLength + Math.random() * (maxLength - minLength);
    const opacity = 0.15 + 0.4 * Math.random(); // more opaque for stormy feel

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
        stroke={`rgba(200,200,255,${opacity})`}
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
        backgroundColor: "rgba(0,0,0,0.2)", // subtle storm overlay
        zIndex: 0,
      }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
        {lines}
      </svg>
    </div>
  );
}
