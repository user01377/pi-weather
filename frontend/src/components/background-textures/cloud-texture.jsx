import React from "react";

export function CloudTexture({
  waveColor = "rgba(255, 255, 255, 0.2)", 
}) {
  return (
    <div
      className="wave-background"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0, // ensures it sits above wrapper but below UI
      }}
    >
      {/* Wave Layers */}
      <svg
        style={{ position: "absolute", bottom: 0, width: "100%", height: "40%" }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={waveColor}
          d="M0,224L48,218.7C96,213,192,203,288,208C384,213,480,235,576,240C672,245,768,235,864,234.7C960,235,1056,245,1152,234.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,
1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      <svg
        style={{ position: "absolute", bottom: 0, width: "100%", height: "50%" }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={waveColor.replace("0.25", "0.15")}
          d="M0,288L60,272C120,256,240,224,360,202.7C480,181,600,171,720,160C840,149,960,139,1080,154.7C1200,171,1320,213,1380,234.7L1440,256L1440,320L1380,320C1320,320,
1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>
    </div>
  );
}
