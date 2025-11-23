// handles which texture.jsx to render

import React from "react";
import { NightClearTexture } from "./night-clear-texture";
import { DayClearTexture } from "./day-clear-texture";
// import RainTexture from "./rain-texture";
// import SnowTexture from "./snow-texture";
// import StormTexture from "./storm-texture";
// import CloudTexture from "./cloud-texture";

/**
 * Returns the appropriate weather texture component.
 * 
 * @param {string} weather - the weather keyword
 * @param {number} opacity - optional, default opacity for the texture/noise
 * @param {boolean} isNight - true if it is currently night
 */

export function getWeatherTexture(weather, opacity = 0.2, isNight) {
  switch (weather) {
    // case "rain":
    //   return <RainTexture opacity={opacity} />;

    // case "snow":
    //   return <SnowTexture opacity={opacity} />;

    // case "storm":
    //   return <StormTexture opacity={opacity} />;

    // case "cloud":
    //   return <CloudTexture opacity={opacity} />;

    case "clear": 
      if (isNight) {
        // pass opacity to NightClearTexture as noiseOpacity
        return <NightClearTexture noiseOpacity={opacity} />;
      } else {
        // pass opacity to DayClearTexture (adjust prop name if needed)
        return <DayClearTexture opacity={opacity} />;
      }

    default:
      return null;
  }
}
