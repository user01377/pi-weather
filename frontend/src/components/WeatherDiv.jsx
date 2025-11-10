import React from "react";
import "../styles/weatherdivstyle.css";

export default function WeatherDiv({ data }) {
  const sunriseStr = data.block2.item2.split(" / ")[0];
  const sunsetStr = data.block2.item2.split(" / ")[1];

  return (
    <div className="weather-wrapper">
      <div className="weather-container">
        <div className="info-box">
            hello world
        </div>

        <div className="hourly-column">
          
        </div>

        {/* AIR CONDITIONS Block */}
        <div className="weather-block">
          <div className="header">AIR CONDITIONS</div>

          <div className="quadrant top-left">
            <div className="quad-content">
              <img src="/display/wind.svg" alt="Wind" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Wind</div>
                <div className="quad-value">{data.block1.item1}</div>
              </div>
            </div>
          </div>

          <div className="quadrant top-right">
            <div className="quad-content">
              <img src="/display/feelslike.svg" alt="Feels Like" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Feels Like</div>
                <div className="quad-value">{data.block1.item2}</div>
              </div>
            </div>
          </div>

          <div className="quadrant bottom-left">
            <div className="quad-content">
              <img src="/display/humidity.svg" alt="Humidity" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Humidity</div>
                <div className="quad-value">{data.block1.item3}</div>
              </div>
            </div>
          </div>

          <div className="quadrant bottom-right">
            <div className="quad-content">
              <img src="/display/precipitation.svg" alt="Precipitation" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Precipitation</div>
                <div className="quad-value">{data.block1.item4}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ENVIRONMENT Block */}
        <div className="weather-block">
          <div className="header">ENVIRONMENT</div>

          <div className="quadrant top-left">
            <div className="quad-content">
              <img src="/display/pressure.svg" alt="Pressure" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Pressure</div>
                <div className="quad-value">{data.block2.item1}</div>
              </div>
            </div>
          </div>

          {/* Sunrise & Sunset quadrants with icons on the left */}
          <div className="quadrant top-right sun-times">
            <div className="quad-content">
              <img src="/sunrise.svg" alt="Sunrise" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Sunrise</div>
                <div className="quad-value">{sunriseStr}</div>
              </div>
            </div>
            <div className="quad-content" style={{ marginTop: "0.5rem" }}>
              <img src="/sunset.svg" alt="Sunset" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Sunset</div>
                <div className="quad-value">{sunsetStr}</div>
              </div>
            </div>
          </div>

          <div className="quadrant bottom-left">
            <div className="quad-content">
              <img src="/display/visibility.svg" alt="Visibility" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Visibility</div>
                <div className="quad-value">{data.block2.item3}</div>
              </div>
            </div>
          </div>

          <div className="quadrant bottom-right">
            <div className="quad-content">
              <img src="/display/cloudcover.svg" alt="Cloud Cover" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Cloud Cover</div>
                <div className="quad-value">{data.block2.item4}</div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
