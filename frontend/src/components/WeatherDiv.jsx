import React from "react";
import "../styles/weatherdivstyle.css";

export default function WeatherDiv({ data }) {
  if (!data) return null;

  // Metrics for tiles
  const tileMetrics = [
    { icon: "/display/wind.svg", header: "Wind", value: data.tiles.wind },
    { icon: "/display/humidity.svg", header: "Humidity", value: data.tiles.humidity },
    { icon: "/display/precipitation.svg", header: "Precipitation", value: data.tiles.precipitation },
    { icon: "/display/feelslike.svg", header: "Feels Like", value: data.tiles.feelsLike },
  ];

  // Metrics for misc info
  const miscMetrics = [
    { icon: "/display/pressure.svg", header: "Pressure", value: data.misc.pressure },
    { icon: "/display/visibility.svg", header: "Visibility", value: data.misc.visibility },
    { icon: "NOT YET ADDED", header: "Dewpoint", value: data.misc.dewpoint },
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

        {/* Left Column */}
        <div className="left-column">

          {/* Hero Panel */}
          <div className="panel hero-panel">
            <div className="hero-main">
              <div className="hero-icon">
                {data.hero.icon ? <img src={data.hero.icon} alt={data.hero.weatherDesc} /> : "🌤"}
              </div>
              <div className="hero-info">
                <div>Rochester</div>
                <div className="hero-temp">{data.hero.temperature}</div>
                <div className="hero-desc">{data.hero.weatherDesc}</div>
                {data.hero.alerts.length > 0 && (
                  <div className="hero-alerts">
                    {data.hero.alerts.map((alert, idx) => (
                      <div key={idx} className="alert">{alert}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tiles + Misc */}
          <div className="tiles-parent">

            {/* Tiles */}
            <div className="tiles-container">
              {tileMetrics.map((m, idx) => (
                <div key={idx} className="panel tile">
                  <img src={m.icon} alt={m.header} className="icon tile-icon" />
                  <div className="tile-header">{m.header}</div>
                  <div className="tile-value">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Misc Info */}
            <div className="panel misc-info">
              {miscMetrics.map((m, idx) => {
                const isSunTimes = typeof m.value === "object";
                if (isSunTimes) {
                  return (
                    <div key={idx} className="misc-entry sun-times-entry">
                      {/* Sunrise */}
                      <div className="sun-pair">
                        <img src={m.value.sunrise.icon} alt="Sunrise" className="icon sun-icon" />
                        <div className="sun-times-text">
                          <span className="sun-label">Sunrise</span>
                          <span className="sun-value">{m.value.sunrise.time}</span>
                        </div>
                      </div>
                      {/* Sunset */}
                      <div className="sun-pair">
                        <img src={m.value.sunset.icon} alt="Sunset" className="icon sun-icon" />
                        <div className="sun-times-text">
                          <span className="sun-label">Sunset</span>
                          <span className="sun-value">{m.value.sunset.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className="misc-entry">
                      {m.icon && <img src={m.icon} alt={m.header} className="icon misc-icon" />}
                      <div className="misc-text">
                        <div className="misc-header">{m.header}</div>
                        <div className="misc-value">{m.value}</div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>

          </div>
        </div>

        {/* Hourly Column */}
        <div className="panel hourly-column">
          {data.hourly.length > 0 ? (
            data.hourly.map((hour, idx) => (
              <div key={idx} className="hour">
                <div>{hour.time ?? "N/A"}</div>
                <div>{hour.icon ? <img src={hour.icon} alt={hour.weather} /> : "🌤"}</div>
                <div>{hour.temperature ?? "N/A"}°</div>
              </div>
            ))
          ) : (
            <div>No hourly data available</div>
          )}
        </div>

      </div>
    </div>
  );
}
