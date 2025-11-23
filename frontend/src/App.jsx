import React, { useEffect } from "react";

import "./index.css";

import "./styles/background.css";
import WeatherDiv from "./components/WeatherDiv.jsx";

import { updateBackground } from "./components/background-logic.js";
import { getWeatherTexture } from "./components/background-textures/ztexture-mapper.jsx";

import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "./utils/fetch-api-data.jsx";
import { getWeatherKeyword } from './utils/weather-keyword-mapper.jsx';
import { isNightNow } from "./utils/parseAPI-time.js";

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

  // computes weather key word for background color and background weather effect "texture"
  const weatherIconUrl = data?.hero?.icon;
  const weatherWord = getWeatherKeyword(weatherIconUrl);
  // const weatherWord = "";
  // debugging ^^^

  // returns a True or False boolean checking if it is night
  const night = isNightNow(data?.misc?.suntimes?.sunrise || "06:00 AM", data?.misc?.suntimes?.sunset || "06:00 PM");
  console.log(night)

  useEffect(() => {
    if (!data?.misc?.suntimes) return;

    updateBackground(weatherWord || "clear", night);
  }, [weatherWord, data]);

  return (
    <div className="app">
      
      <div className="background-wrapper">
        {getWeatherTexture(weatherWord || "clear", night)}
      </div>



      <div style={{ position: "relative", zIndex: 1 }}>
        {isError && <div style={{ color: "red" }}>Error loading weather data: {error.message}</div>}
        {!isError && <WeatherDiv data={data} loading={isLoading} />}
      </div>

    </div>
  );
  
}