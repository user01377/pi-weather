// handles which texture.jsx to render

import React from "react";
import { NightClearTexture } from "./night-clear-texture";
// import { DayClearTexture } from "./day-clear-texture";
// import RainTexture from "./rain-texture";
// import SnowTexture from "./snow-texture";
// import StormTexture from "./storm-texture";
import { CloudTexture } from "./cloud-texture";

/**
 * Returns the appropriate weather texture component.
 * 
 * @param {string} weather - the weather keyword
 * @param {boolean} isNight - true if it is currently night
 * @param {string} cloudType - cloud type
 */

export function getWeatherTexture(weather, isNight, cloudType) {
  switch (weather) {
    // case "rain":
    //   return <RainTexture />;

    // case "snow":
    //   return <SnowTexture />;

    // case "storm":
    //   return <StormTexture />;

    case "cloud":
      return <CloudTexture type = {cloudType}/>;

    case "clear": 
      if (isNight) {
        return <NightClearTexture />;

      } else {

        // return <DayClearTexture />;
      }

    default:
      return null;
  }
}
