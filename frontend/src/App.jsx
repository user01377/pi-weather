import React, { useEffect } from "react";
import "./index.css";
import WeatherDiv from "./components/WeatherDiv.jsx";
import SineWaveLayer from "./components/wave-render.jsx";
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
    <div className="app">

      <div className="background-wrapper"></div>

      <SineWaveLayer 
        weather={weatherWord} 
        className="sine-wave-layer" 
      />

      {isError && (
        <div style={{ color: "red" }}>
          Error loading weather data: {error.message}
        </div>
      )}

      {!isError && (
        <WeatherDiv data={data} loading={isLoading} />
      )}
    </div>
  );
}
