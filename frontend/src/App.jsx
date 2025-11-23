import React, { useEffect } from "react";
import "./index.css";
import WeatherDiv from "./components/WeatherDiv.jsx";
import { SubtleDotTexture } from "./components/background-texture.jsx";
import "./styles/background.css";
import { updateBackground } from "./components/background-logic.js";

import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "./utils/call-weather.jsx";
import { getWeatherKeyword } from './utils/background-iconmapping.jsx';

export default function App() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["weather"],         // Unique key for caching
    queryFn: fetchWeather,          // Your API helper
    refetchInterval: 240_000,        // Auto-refresh every 4 mins
    staleTime: 90_000,              // Data considered fresh for 1.5 mins
    refetchOnWindowFocus: false,     // Refresh when user comes back to tab and if stale is True
    refetchIntervalInBackground: true, 
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const weatherIconUrl = data?.hero?.icon;
  const weatherWord = getWeatherKeyword(weatherIconUrl);
  // const weatherWord = "";
  // debugging ^^^

  useEffect(() => {
    if (!data?.misc?.suntimes) return;

    updateBackground(weatherWord || "clear", data?.misc?.suntimes?.sunrise || "06:00 AM", data?.misc?.suntimes?.sunset || "06:00 PM");
  }, [weatherWord, data]);

  return (
    <div className="app" style={{ position: "relative", width: "100vw", height: "100vh" }}>
  
  {/* Dynamic background color */}
  <div className="background-wrapper" style={{ width: "100%", height: "100%" }}></div>

  {/* Subtle texture overlay */}
  <SubtleDotTexture
    dotSize={2}
    spacing={35}
    color="rgba(255,255,255,0.05)"
  />

  {/* Weather panels on top */}
  <div style={{ position: "relative", zIndex: 1 }}>
    {isError && <div style={{ color: "red" }}>Error loading weather data: {error.message}</div>}
    {!isError && <WeatherDiv data={data} loading={isLoading} />}
  </div>

</div>
  );
  
}