import React from "react";
import "../styles/weatherdivstyle.css";

export default function WeatherDiv({ data }) {
  const sunriseStr = data.block2.item2.split(" / ")[0];
  const sunsetStr = data.block2.item2.split(" / ")[1];

  const metrics = [
    { icon: "/display/wind.svg", header: "Wind", value: data.block1.item1 },
    { icon: "/display/humidity.svg", header: "Humidity", value: data.block1.item3 },
    { icon: "/display/precipitation.svg", header: "Precipitation", value: data.block1.item4 },
    { icon: "/display/feelslike.svg", header: "Feels Like", value: data.block1.item2 },
    { icon: "/display/pressure.svg", header: "Pressure", value: data.block2.item1 },
    { 
      icon: "/sunrise.svg", 
      header: "Sun Times", 
      value: { sunrise: sunriseStr, sunset: sunsetStr } // object instead of string
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
          <div className="hero-panel">
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
            <div className="tiles-container">
              {metrics.slice(0, 4).map((m, idx) => (
                <div key={idx} className="tile">
                  <img src={m.icon} alt={m.header} className="tile-icon" />
                  <div className="tile-header">{m.header}</div>
                  <div className="tile-value">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="misc-info">
              {metrics.slice(4, 8).map((m, idx) => (
                <div key={idx} className="misc-entry">
                  <img src={m.icon} alt={m.header} className="misc-icon" />
                  <div className="misc-text">
                    <div className="misc-header">{m.header}</div>
                    <div className="misc-value">
                      {typeof m.value === "object" ? (
                        <div className="sun-times">
                          <span> {m.value.sunrise}</span> / <span> {m.value.sunset}</span>
                        </div>
                      ) : (
                        m.value
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hourly Column */}
        <div className="hourly-column">
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
