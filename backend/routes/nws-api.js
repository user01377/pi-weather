import express from "express";
import fetch from "node-fetch";
import SunCalc from "suncalc";

const router = express.Router();

// hard coded values for RIT and cache
const DEFAULT_LAT = 43.083308;
const DEFAULT_LON = -77.676973;
const STATION_ID = "KROC";
const CACHE_DURATION = 10 * 1000;

let cache = {};

export const NWSFetch = async (url) => {
  const res = await fetch(url, {
    headers: {
      "User-Agent": process.env.USER_AGENT,
      Accept: "application/ld+json",
    },
  });
  if (!res.ok) throw new Error(`NWS API error: ${res.status}`);
  return res.json();
};

export const getCachedData = async (key, fetchFunction) => {
  const now = Date.now();
  if (cache[key] && now - cache[key].timestamp < CACHE_DURATION) {
    console.log(`[CACHE] Returning Cached Data ${key}`)
    return cache[key].data;
  }
  console.log(`[FETCH] Fetching Fresh Data For You ${key}`)
  const data = await fetchFunction();
  cache[key] = { data, timestamp: now };
  return data;
};

// get current observation through nws api
export const getCurrentObservation = async () => {
  return NWSFetch(`https://api.weather.gov/stations/${STATION_ID}/observations/latest`);
};

router.get("/current", async (req, res) => {
  try {
    const data = await getCachedData(`current-${STATION_ID}`, async () => {
      const [obs, pointData, alertsData] = await Promise.all([
        getCurrentObservation(),
        NWSFetch(`https://api.weather.gov/points/${DEFAULT_LAT},${DEFAULT_LON}`),
        NWSFetch(`https://api.weather.gov/alerts/active?point=${DEFAULT_LAT},${DEFAULT_LON}`)
      ]);

      let forecast = null;
      try {
        forecast = await NWSFetch(pointData.forecast);
      } catch (e) {
        console.warn("⚠️ Failed to fetch forecast:", e.message);
      }

      const sunTimes = SunCalc.getTimes(new Date(), DEFAULT_LAT, DEFAULT_LON);
      const firstPeriod = forecast?.properties?.periods?.[0] || {};

      return { //returns all data needed
        temperature: obs?.temperature?.value ?? null,
        feelsLike: obs?.windChill?.value ?? obs?.temperature?.value ?? null,
        weather: obs?.textDescription ?? "Unavailable",
        alerts: alertsData?.features?.map(a => a?.properties?.headline).filter(Boolean) ?? [],
        humidity: obs?.relativeHumidity?.value ?? null,
        wind: {
          speed: obs?.windSpeed?.value ?? null,
          direction: obs?.windDirection?.value ?? null,
        },
        precipitation: {
          type: firstPeriod?.shortForecast ?? null,
          chance: firstPeriod?.probabilityOfPrecipitation?.value ?? null,
        },
        pressure: obs?.barometricPressure?.value ?? null,
        visibility: obs?.visibility?.value ?? null,
        sunrise: sunTimes.sunrise,
        sunset: sunTimes.sunset,
        cloudCoverage: obs?.cloudLayers?.map(c => c.amount).join(", ") || "Unknown",
        icon: obs?.icon || "default-icon.png",
      };
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;