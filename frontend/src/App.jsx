import React, { useEffect, useState, useMemo } from "react";

import "./index.css";
import "./styles/background.css";
import WeatherDiv from "./components/WeatherDiv.jsx";

import { updateBackground } from "./components/background-logic.js";
import { getWeatherTexture } from "./components/background-textures/ztexture-mapper.jsx";

import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "./utils/fetch-api-data.jsx";

import { getWeatherKeyword } from './utils/weather-keyword-mapper.jsx';
import { isNightNow } from "./utils/check-isNight.js";

export default function App() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    } = useQuery({
      queryKey: ["weather"],         // Unique key for caching
      queryFn: fetchWeather,          // Your API helper
      refetchInterval: 720_000,        // 12 mins refresh time, 5 refresh/hr
      staleTime: 90_000,              // Data considered fresh for 1.5 mins
      refetchOnWindowFocus: false,     // Refresh when user comes back to tab and if stale is True
      refetchIntervalInBackground: true, 
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    });

    // computes weather key word for background color and background weather effect "texture"
    const weatherIconUrl = data?.hero?.icon ?? "clear";
    const weatherWord = getWeatherKeyword(weatherIconUrl);
    // const weatherWord = "clear";
    // debugging ^^^

    // computes the true false boolean for night
    const night = isNightNow(
      data?.misc?.suntimes?.sunrise || "06:00 AM",
      data?.misc?.suntimes?.sunset || "06:00 PM"
    );

    // const night = false;
    // debugging ^^^

    // stores the cloud data into a variable
    const cloudMap = {
      "/few": "few",
      "/sct": "sct",
      "/bkn": "bkn",
      "/ovc": "ovc",
    };
    
    let cloudType = null;
    for (const key in cloudMap) {
      if (weatherIconUrl.includes(key)) {
        cloudType = cloudMap[key];
        break; // stop at the first match
      }
    }
    
    // track previous weather/night for memoization
    const [prevWeatherWord, setPrevWeatherWord] = useState(null);
    const [prevNight, setPrevNight] = useState(null);

    const shouldUpdateBackground =
      prevWeatherWord !== weatherWord || prevNight !== night;

    useEffect(() => {
      if (!data?.misc?.suntimes) return;

      if (prevWeatherWord === null || prevNight === null || shouldUpdateBackground) {
        updateBackground(weatherWord, night)
        setPrevWeatherWord(weatherWord);
        setPrevNight(night);
      }
    }, [shouldUpdateBackground, weatherWord, night, data, prevWeatherWord, prevNight]);

    // memoize texture so it only re-mounts when WEATHERWORD or NIGHT changes
    const memoizedTexture = useMemo(() => {
      return getWeatherTexture(weatherWord || "clear", night, cloudType);
    }, [weatherWord, night, cloudType]);

  return (
    <div className="app">

      {/* always mount the texture once, then memoize for future updates */}
      {prevWeatherWord === null || prevNight === null ? 
        getWeatherTexture(weatherWord || "clear", night, cloudType) 
        : memoizedTexture
      }

      {/* background color layer */}
      <div className="background-wrapper"></div>

      {/* always re-render the UI data component */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {isError && !data && (<div style={{ color: "red" }}>Error loading weather data: {error.message}</div>)}
        {data && (
          <>
            {isError && (
              <div style={{ color: "orange", marginBottom: "8px" }}>
                Failed to refresh. Showing stale last fetch data.
              </div>
            )}

            <WeatherDiv
              data={data}
              loading={isLoading || isFetching}
            />
          </>
        )}
      </div>

    </div>
  );
}