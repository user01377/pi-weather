import React from "react";
import "./index.css";
import WeatherDiv from "./components/WeatherDiv.jsx";
import Background from "./components/Background.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "./utils/call-weather.jsx";

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
    refetchOnWindowFocus: true,     // Refresh when user comes back to tab
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  return (
    <div className="app">
      <Background />

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
