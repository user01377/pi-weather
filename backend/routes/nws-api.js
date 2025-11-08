import express from "express";
import fetch from "node-fetch";
import SunCalc from "suncalc";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config({ path: '../.env'});

const DEFAULT_LAT = 43.083308;
const DEFAULT_LON = -77.676973;
const STATION_ID = "KROC";

let cache = {};
const CACHE_DURATION = parseInt(process.env.CACHE_DURATION, 10) * 1000; // uses .env, declares base 10, * 1000 to convert seconds over to correct unit
const USER_AGENT = process.env.USER_AGENT;

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
    return cache[key].data;
  }
  const data = await fetchFunction();
  cache[key] = { data, timestamp: now };
  return data;
};

export const getCurrentObservation = async () => {
  return NWSFetch(`https://api.weather.gov/stations/${STATION_ID}/observations/latest`);
};

// Express route
router.get("/current", async (req, res) => {
  try {
      const data = await getCachedData(`current-${STATION_ID}`, async () => {
      const obs = await getCurrentObservation();
      const pointData = await NWSFetch(`https://api.weather.gov/points/${DEFAULT_LAT},${DEFAULT_LON}`);
      const forecast = await NWSFetch(pointData.forecast);
      const alertsData = await NWSFetch(`https://api.weather.gov/alerts/active?point=${DEFAULT_LAT},${DEFAULT_LON}`)
      const sunTimes = SunCalc.getTimes(new Date(), DEFAULT_LAT, DEFAULT_LON);

      return {
        temperature: obs.temperature?.value,
        feelsLike: obs.windChill?.value || obs.temperature?.value,
        weather: obs.textDescription,
        alerts: alertsData.features?.map(a => a?.properties?.headline).filter(Boolean) || [],
        humidity: obs.relativeHumidity?.value,
        wind: {
          speed: obs.windSpeed?.value,
          direction: obs.windDirection?.value
        },
        precipitation: {
          type: forecast?.properties?.periods[0]?.shortForecast || null,
          chance: forecast?.properties?.periods[0]?.probabilityOfPrecipitation?.value || null
        },
        pressure: obs.barometricPressure?.value,
        visibility: obs.visibility?.value,
        sunrise: sunTimes.sunrise,
        sunset: sunTimes.sunset,
        cloudCoverage: obs.cloudLayers?.map(c => c.amount).join(", ") || "Unknown",
        icon: obs.icon || "default-icon.png",
      };
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

  export default router;

// ---------------------
// TEST BLOCK
// ---------------------
// import url from "url";
// const __filename = url.fileURLToPath(import.meta.url);

// if (process.argv[1] === __filename) {
//   // This only runs if you call `node nws-api.js` directly
//   (async () => {
//     try {
//       console.log("🧪 Running self-test of current observation fetch...");

//         const testData = await getCachedData(`current-${STATION_ID}`, async () => {
//         const obs = await getCurrentObservation();
//         const pointData = await NWSFetch(`https://api.weather.gov/points/${DEFAULT_LAT},${DEFAULT_LON}`);

//         // Get forecast safely
//         let forecast;
//         try {
//           forecast = await NWSFetch(pointData.forecast);
//         } catch (e) {
//           console.warn("⚠️ Failed to fetch forecast:", e.message);
//           forecast = null;
//         }

//         // Get alerts safely
//         let alertsData;
//         try {
//           alertsData = await NWSFetch(`https://api.weather.gov/alerts/active?point=${DEFAULT_LAT},${DEFAULT_LON}`);
//         } catch (e) {
//           console.warn("⚠️ Failed to fetch alerts:", e.message);
//           alertsData = { features: [] };
//         }

//         const sunTimes = SunCalc.getTimes(new Date(), DEFAULT_LAT, DEFAULT_LON);

//         // Extract forecast period safely
//         const forecastPeriods = forecast?.properties?.periods || [];
//         const firstPeriod = forecastPeriods[0] || {};
//         const iconUrl = obs.icon || "default-icon.png"; // fallback in case icon is null

//         return {
//           temperature: obs?.temperature?.value ?? null,
//           feelsLike: obs?.windChill?.value ?? obs?.temperature?.value ?? null,
//           weather: obs?.textDescription ?? "Unavailable",
//           alerts: alertsData.features?.map(a => a?.properties?.headline).filter(Boolean) ?? [],
//           humidity: obs?.relativeHumidity?.value ?? null,
//           wind: {
//             speed: obs?.windSpeed?.value ?? null,
//             direction: obs?.windDirection?.value ?? null,
//           },
//           precipitation: {
//             type: firstPeriod?.shortForecast ?? null,
//             chance: firstPeriod?.probabilityOfPrecipitation?.value ?? null,
//           },
//           pressure: obs?.barometricPressure?.value ?? null,
//           visibility: obs?.visibility?.value ?? null,
//           sunrise: sunTimes.sunrise,
//           sunset: sunTimes.sunset,
//           cloudCoverage: obs.cloudLayers?.map(c => c.amount).join(", ") || "Unknown",
//           icon: obs.icon || "default-icon.png",
//         };
//       });

//       console.log("✅ Self-test data retrieved successfully:\n", JSON.stringify(testData, null, 2));
//     } catch (err) {
//       console.error("❌ Error in self-test:", err);
//     }
//   })();
// }

// export default router;