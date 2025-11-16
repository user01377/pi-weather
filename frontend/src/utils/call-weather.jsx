import { degreesToCardinal16 } from "./degreetocardinal.jsx";

export async function fetchWeather() {
  const res = await fetch("http://localhost:8000/current");

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  const json = await res.json();
  console.log("Raw API data:", json); // remove in production so no printy json data 

  // mapping from app.jsx moved to this helper jsx
  const mappedData = {
    hero: {
      icon: json.icon ?? "",
      temperature: `${json.temperature ?? "N/A"}°`,
      weatherDesc: json.weather ?? "N/A",
      alerts: json.alerts ?? [],
    },

    tiles: {
      wind: {
        value: json.wind?.speed ?? "null",
        subValue: json.wind?.speed == null
          ? "" 
          : typeof json.wind?.direction === "number"
            ? degreesToCardinal16(json.wind.direction) 
            : "gst", 
      },
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

  return mappedData;
}
