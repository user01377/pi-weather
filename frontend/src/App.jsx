import React, { useState, useEffect } from "react";
import "./index.css";
import WeatherDiv from "./components/WeatherDiv.jsx";
import Background from "./components/Background.jsx";

function App() {
  // initial placeholder data so not empty
  const [data, setData] = useState({
    hero: {
      icon: "",
      temperature: "Loading...",
      weatherDesc: "Loading...",
      alerts: [],
    },

    tiles: {
      wind: (
        <>
          Loading...
          <br />
          Loading...
        </>
      ),
      humidity: "Loading...",
      precipitation: "Loading...",
      feelsLike: "Loading...",
    },

    misc: {
      pressure: "Loading...",
      visibility: "Loading...",
      humidity: "Loading...",
      cloudCoverage: "Loading...",
      suntimes: { sunrise: "Loading...", sunset: "Loading..." },
    },

    lastUpdated: "Loading...",

    hourly: [],

  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  fetch("http://localhost:8000/current")
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((json) => {
      console.log("Raw API data:", json);

      const mappedData = {
        hero: {
          icon: json.icon ?? "",
          temperature: `${json.temperature ?? "N/A"}°`,
          weatherDesc: json.weather ?? "N/A",
          alerts: json.alerts ?? [],
        },

        tiles: {
          wind: (
            <>
              {json.wind?.speed ?? "N/A"} mp/h
              <br />
              {json.wind?.direction ?? "N/A"}°
            </>
          ),
          humidity: `${json.humidity ?? "N/A"}%`,
          precipitation: `${json.precipitation ?? 0}%`,
          feelsLike: `${json.feelsLike ?? "N/A"}°`,
        },

        misc: {
          pressure: `${json.pressure ?? "N/A"} inHg`,
          visibility: `${json.visibility ?? "N/A"} NM`,
          dewpoint: `${json.dewpoint ?? "N/A"}°`,
          cloudCoverage: `${json.cloudCoverage ?? "N/A"}%`,
          suntimes: {
            sunrise: json.sunrise ?? "N/A",
            sunset: json.sunset ?? "N/A",
          },
        },

        lastUpdated: json.lastUpdated ?? "N/A",

        hourly: json.hourly ?? [],
      };

      setData(mappedData);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching weather data:", err);
      setError(err);
      setLoading(false);
    });
}, []);

return (
  <div className="app">
    <Background />
    {error && <div style={{ color: "red" }}>Error loading weather data</div>}
    {!error && <WeatherDiv data={data} loading={loading} />}
  </div>
  );
}

export default App;
