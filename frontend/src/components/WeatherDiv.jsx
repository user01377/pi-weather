import React from "react";
import "../styles/weatherdivstyle.css";
import { GetCustomIcon } from "../utils/icon-mapping.jsx";

export default function WeatherDiv({ data, loading, isFetching }) {
  // Initial loading state
  if (loading || !data) {
    return (
      <div
        className="weather-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // full height to center vertically
          backgroundColor: "rgba(0, 0, 0, 0.6)", // subtle dark overlay
        }}
      >
        <div
          className="weather-container"
          style={{
            padding: "2rem 3rem",
            borderRadius: "15px",
            backgroundColor: "#DBDBDB", // bright background
            color: "black",
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(0,0,0,0.4)",
          }}
        >
          Loading weather data...
        </div>
      </div>
    );
  }

  // metrics for the tiles
  const tileMetrics = [
    {
      icon: "/display/wind.svg",
      header: "Wind",
      value: `${data.tiles.wind.value}mp/h`,
      subValue: data.tiles.wind.subValue,
    },
    { icon: "/display/humidity.svg", header: "Humidity", value: data.tiles.humidity },
    { icon: "/display/precipitation.svg", header: "Precipitation", value: data.tiles.precipitation },
    { icon: "/display/feelslike.svg", header: "Feels Like", value: data.tiles.feelsLike },
  ];

  // metrics for misc info div
  const miscMetrics = [
    { icon: "/display/pressure.svg", header: "Pressure", value: data.misc.pressure },
    { icon: "/display/visibility.svg", header: "Visibility", value: data.misc.visibility },
    { icon: "display/dewpoint.svg", header: "Dewpoint", value: data.misc.dewpoint },
    { icon: "/display/cloudcover.svg", header: "Cloud Cover", value: data.misc.cloudCoverage },
    {
      icon: null,
      header: "Sun Times",
      value: {
        sunrise: { icon: "/sunrise.svg", time: data.misc.suntimes.sunrise },
        sunset: { icon: "/sunset.svg", time: data.misc.suntimes.sunset },
      },
    },
  ];

  return (
    <div className="weather-wrapper">
      <div className="weather-container">

        {/* Refresh indicator for background updates */}
        {isFetching && (
          <div className="refreshing-indicator">Updating...</div>
        )}

        {/* Left Column */}
        <div className="left-column">

          {/* Hero Panel */}
          <div className="panel hero-panel">
            <div className="hero-main">

              {/* Left: Icon */}
              {data.hero.icon && (
                <div className="hero-icon-box">
                  <GetCustomIcon
                    iconUrl={data.hero.icon}
                    alt={data.hero.weatherDesc}
                    className="hero-icon-img"
                  />
                </div>
              )}

              {/* Middle: City */}
              <div className="hero-city">Rochester</div>

              {/* Right: Temp + Desc */}
              <div className="hero-right">
                <div className="hero-temp">{data.hero.temperature}</div>
                <div className="hero-desc">{data.hero.weatherDesc}</div>
              </div>

            </div>
          </div>

          {/* Tiles */}
          <div className="tiles-row">
            {tileMetrics.map(({ icon, header, value, subValue }, idx) => (
              <div key={idx} className="panel tile-panel">
                <div className="tile-top-row">
                  <img src={icon} alt={header} className="tile-icon" />
                  <div className="tile-text">
                    <div className="tile-header">{header}</div>
                    <div className="tile-value-row">
                      <span className="tile-value">{value}</span>
                      <span className="tile-subvalue">{subValue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Misc Info */}
          <div className="panel misc-info">
            {/* Row 1 */}
            <div className="misc-entry">
              <img src={miscMetrics[0].icon} alt={miscMetrics[0].header} className="icon misc-icon" />
              <div className="misc-text">
                <div className="misc-header">{miscMetrics[0].header}</div>
                <div className="misc-value">{miscMetrics[0].value}</div>
              </div>
            </div>

            <div className="misc-entry">
              <img src={miscMetrics[1].icon} alt={miscMetrics[1].header} className="icon misc-icon" />
              <div className="misc-text">
                <div className="misc-header">{miscMetrics[1].header}</div>
                <div className="misc-value">{miscMetrics[1].value}</div>
              </div>
            </div>

            <div className="misc-entry">
              <img src={miscMetrics.find(m => typeof m.value === "object").value.sunrise.icon} alt="Sunrise" className="icon misc-icon" />
              <div className="misc-text">
                <div className="misc-header">Sunrise</div>
                <div className="misc-value">{miscMetrics.find(m => typeof m.value === "object").value.sunrise.time}</div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="misc-entry">
              <img src={miscMetrics[2].icon} alt={miscMetrics[2].header} className="icon misc-icon" />
              <div className="misc-text">
                <div className="misc-header">{miscMetrics[2].header}</div>
                <div className="misc-value">{miscMetrics[2].value}</div>
              </div>
            </div>

            <div className="misc-entry">
              <img src={miscMetrics[3].icon} alt={miscMetrics[3].header} className="icon misc-icon" />
              <div className="misc-text">
                <div className="misc-header">{miscMetrics[3].header}</div>
                <div className="misc-value">{miscMetrics[3].value}</div>
              </div>
            </div>

            <div className="misc-entry">
              <img src={miscMetrics.find(m => typeof m.value === "object").value.sunset.icon} alt="Sunset" className="icon misc-icon" />
              <div className="misc-text">
                <div className="misc-header">Sunset</div>
                <div className="misc-value">{miscMetrics.find(m => typeof m.value === "object").value.sunset.time}</div>
              </div>
            </div>
          </div>

          <div className="last-updated">
            {`Last Fetch: ${new Date(data.lastUpdated).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })} — KROC INTL METAR`}
          </div>

        </div>

        {/* Hourly Column */}
        <div className="panel hourly-column-panel">
          <div className="hourly-column-content">
            {data.hourly.map((h, idx) => {
              const hourFormatted = h.hour.replace(/^0/, '').split(':')[0] + h.hour.slice(-2);
              return (
                <div key={idx} className={`hour-row ${idx % 2 === 0 ? "even" : "odd"}`}>
                  <div className="hour-left">
                    <div className="hourly-icon-box">
                      <GetCustomIcon
                        iconUrl={h.icon}
                        alt={h.shortForecast}
                        className="hourly-icon-img animate-icon"
                      />
                    </div>
                    <div className="hour-left-text">
                      <div className="hour-time">{hourFormatted}</div>
                      <div className="hour-desc">{h.shortForecast}</div>
                    </div>
                  </div>
                  <div className="hour-right">
                    <div className="hour-temp">{h.temp}°</div>
                    <div className="hour-pop">Precip: {h.pop}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
