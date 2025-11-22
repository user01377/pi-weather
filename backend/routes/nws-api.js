import express from "express";
import fetch from "node-fetch";
import SunCalc from "suncalc";

const router = express.Router();

// hard coded values for RIT and cache
const DEFAULT_LAT = 43.083308;
const DEFAULT_LON = -77.676973;
const STATION_ID = "KROC";
const CACHE_DURATION = 30 * 1000; // seconds for cache to last

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

// generalized caching function
export const getCachedData = async (key, fetchFunction) => {
  const now = Date.now();
  if (cache[key] && now - cache[key].timestamp < CACHE_DURATION) {
    console.log(`[CACHE] Returning Cached Data ${key}`);
    return cache[key].data;
  }
  console.log(`[FETCH] Fetching Fresh Data For You ${key}`);
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
      // fetch current observation, point info, and active alerts in parallel
      const [obs, pointData, alertsData] = await Promise.all([
        getCurrentObservation(),
        NWSFetch(`https://api.weather.gov/points/${DEFAULT_LAT},${DEFAULT_LON}`),
        NWSFetch(`https://api.weather.gov/alerts/active?point=${DEFAULT_LAT},${DEFAULT_LON}`),
      ]);

      // for the hourly data
      const hourlyUrl = pointData.forecastHourly;
      let next8 = [];
      let currentPop = 0;

      if (hourlyUrl) {
        const forecastHourly = await NWSFetch(hourlyUrl);
        const periods = forecastHourly?.periods ?? [];

        if (Array.isArray(periods) && periods.length > 0) {
          // map next 8 hours
          const now = new Date();
          next8 = periods
            .filter(period => new Date(period.startTime) >= now)  // only future/current hours
            .slice(0, 8)                                          // take the next 8
            .map(period => {
              const date = new Date(period.startTime);
              return {
                hour: date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                  timeZone: 'America/New_York',
                }),
                temp: period.temperature,
                shortForecast: period.shortForecast,
                icon: period.icon,
                pop: period.probabilityOfPrecipitation?.value ?? 0,
              };
            });

          // calculating current hour precip chance
          const nowHour = new Date().getHours();
          const currentHourPeriod = periods.find(period => new Date(period.startTime).getHours() === nowHour);
          currentPop = currentHourPeriod?.probabilityOfPrecipitation?.value ?? 0;
        } else {
          console.warn("No hourly periods available:", forecastHourly);
        }
      } else {
        console.warn("No hourly URL available in pointData:", pointData);
      }

      // calculating sunrise/sunset in 12hr format
      const sunTimes = SunCalc.getTimes(new Date(), DEFAULT_LAT, DEFAULT_LON);
      const sunrise_calc = new Date(sunTimes.sunrise).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
      });
      const sunset_calc = new Date(sunTimes.sunset).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
      });

      // feels like changes with seasons
      let feelsLike = obs?.heatIndex?.value ?? obs?.windChill?.value ?? obs?.temperature?.value ?? null;

      // cloud coverage computation
      let cloudCoverage = null;

      if (Array.isArray(obs?.cloudLayers) && obs.cloudLayers.length > 0) {
        const cloudMap = { FEW: 0.1875, SCT: 0.4375, BKN: 0.75, OVC: 1.0 };

        let totalThickness = 0;
        let weightedSum = 0;
        let prevBase = 0;

        for (const layer of obs.cloudLayers) {
          const base = layer.base?.value ?? prevBase; // fallback if missing
          const fraction = cloudMap[layer.amount] ?? 0; // fallback if unknown code
          const thickness = base - prevBase;

          weightedSum += fraction * thickness;4
          totalThickness += thickness;
          prevBase = base;
        }

        cloudCoverage = totalThickness ? Math.round((weightedSum / totalThickness) * 100) : 0;
      }

      // returns all data values
      return { 
        temperature: obs?.temperature?.value != null
          ? Math.round((obs.temperature.value * 9 / 5) + 32) // conversion to fahrenheit
          : null,

        feelsLike: feelsLike != null
          ? Math.round((feelsLike * 9 / 5) + 32)
          : null,

        weather: obs?.textDescription ?? "Unavailable",

        alerts: alertsData?.features?.map(a => a?.properties?.headline).filter(Boolean) ?? [],

        humidity: obs?.relativeHumidity?.value != null
          ? Math.round(obs.relativeHumidity.value * 10) / 10
          : null,

        dewpoint: obs?.dewpoint?.value != null
        ? Math.round((obs.dewpoint.value * 9 / 5) + 32) // conversion to fahrenheit
        : null,
        
        wind: {
          speed: obs?.windSpeed?.value != null
            ? Math.round(obs.windSpeed.value * 0.621371)
            : obs?.windGust?.value != null
              ? Math.round(obs.windGust.value * 0.621371)
              : null,
              
          direction: obs?.windDirection?.value ?? null
        },

        precipitation: currentPop,

        pressure: obs?.barometricPressure?.value != null
          ? Math.round((obs.barometricPressure.value * 0.0002953) * 100) / 100 // Pa to inHg
          : null,

        visibility: obs?.visibility?.value != null
          ? Math.round((obs.visibility.value * 0.000539957) * 100) / 100 // Meters to NauticalMiles
          : null,

        sunrise: sunrise_calc,

        sunset: sunset_calc,

        cloudCoverage,

        icon: obs?.icon || "err-icon.png",

        hourly: next8,

        lastUpdated: new Date().toISOString(),
      };
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
