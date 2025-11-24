import React from "react";

export function DayClearTexture({
  waveColor = "rgba(255,255,255,0.35)", // more opaque than cloud waves
  waveHeight = 350,                      // how tall the wave spans downward
  curvature = 0.25,                       // how curvy the top wave is
  style = {},
}) {
  const path = `
    M 0 ${waveHeight * 0.3}
    C ${window.innerWidth * curvature} 0,
      ${window.innerWidth * (1 - curvature)} ${waveHeight},
      ${window.innerWidth} ${waveHeight * 0.3}
    L ${window.innerWidth} 0
    L 0 0
    Z
  `;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0, // ensures it sits above wrapper but below UI
        backgroundColor: "rgb(32,167,219)"
      }}
    >
      <svg
        width="100%"
        height={waveHeight}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <path d={path} fill={waveColor} />
      </svg>
    </div>
  );
}
