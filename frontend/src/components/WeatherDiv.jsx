import React from "react";
import "../styles/weatherdivstyle.css";

export default function WeatherDiv({ data }) {
  const metrics = [
    { icon: "/display/wind.svg", header: "Wind", value: data.block1.item1 },
    { icon: "/display/humidity.svg", header: "Humidity", value: data.block1.item3 },
    { icon: "/display/precipitation.svg", header: "Precipitation", value: data.block1.item4 },
    { icon: "/display/feelslike.svg", header: "Feels Like", value: data.block1.item2 },
    { icon: "/display/pressure.svg", header: "Pressure", value: data.block2.item1 },
    { 
      icon: null,
      header: "Sun Times",
      value: { 
        sunrise: { icon: "/sunrise.svg", time: data.block2.item2.sunrise ?? "Loading..." }, 
        sunset: { icon: "/sunset.svg", time: data.block2.item2.sunset ?? "Loading..." } 
      } 
    },
    { icon: "/display/visibility.svg", header: "Visibility", value: data.block2.item3 },
    { icon: "/display/cloudcover.svg", header: "Cloud Cover", value: data.block2.item4 },
  ];

  return (
    <div className="weather-wrapper">
      <div className="weather-container">

        {/* Left Column */}
        <div className="left-column">

          {/* Hero Panel */}
          <div className="panel hero-panel">
            <div className="hero-main">
              <div className="hero-icon">🌤</div>
              <div className="hero-info">
                <div className="hero-temp">72°F</div>
                <div className="hero-desc">Mostly Sunny</div>
              </div>
            </div>
          </div>

          {/* Tiles + Misc */}
          <div className="tiles-parent">

            {/* Tiles */}
            <div className="tiles-container">
              {metrics.slice(0, 4).map((m, idx) => (
                <div key={idx} className="panel tile">
                  <img src={m.icon} alt={m.header} className="icon tile-icon" />
                  <div className="tile-header">{m.header}</div>
                  <div className="tile-value">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Misc Info */}
            <div className="panel misc-info">
              {metrics.slice(4, 8).map((m, idx) => {
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
          {[1, 2, 3, 4, 5, 6].map((h, idx) => (
            <div key={idx} className="hour">
              <div>{h + 12}:00 PM</div>
              <div>🌤</div>
              <div>70°F</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
