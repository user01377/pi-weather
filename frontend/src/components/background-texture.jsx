import React from "react";

/**
 * SubtleDotTexture
 * A static, low-opacity micro-dot overlay for glassmorphic dashboards.
 */
export function SubtleDotTexture({
  dotSize = 2,           // radius of each dot
  spacing = 40,          // distance between dots
  color = "rgba(255,255,255,0.08)", // dot color and opacity
  style = {},            // extra styles
}) {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        overflow: "visible",
        ...style,
      }}
    >
      <defs>
        <pattern
          id={id}
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={dotSize / 2} cy={dotSize / 2} r={dotSize / 2} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
