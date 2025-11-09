import React from "react";
import "../styles/weatherdivstyle.css";

export default function WeatherDiv({ data }) {
  return (
    <div className="weather-wrapper">
      <div className="weather-container">

        {/* First rectangle */}
        <div className="weather-block">
          <div className="header">AIR CONDITIONS</div>

          <div className="quadrant top-left">
            <div className="quad-content">
              <img src="./public/display/wind.svg" alt="Wind Icon" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Wind</div>
                <div className="quad-value">{data.block1.item1}</div>
              </div>
            </div>
          </div>

          <div className="quadrant top-right">
            <div className="quad-content">
              <img src="./public/display/feelslike.svg" alt="Feels Like Icon" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Feels Like</div>
                <div className="quad-value">{data.block1.item2}</div>
              </div>
            </div>
          </div>

          <div className="quadrant bottom-left">
            <div className="quad-content">
              <img src="./public/display/humidity.svg" alt="Humidity Icon" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Humidity</div>
                <div className="quad-value">{data.block1.item3}</div>
              </div>
            </div>
          </div>

          <div className="quadrant bottom-right">
            <div className="quad-content">
              <img src="./public/display/precipitation.svg" alt="Precipitation Icon" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Precipitation</div>
                <div className="quad-value">{data.block1.item4}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Second rectangle */}
        <div className="weather-block">
          <div className="header">ENVIRONMENT</div>

          <div className="quadrant top-left">
            <div className="quad-content">
              <img src="./public/display/pressure.svg" alt="Pressure Icon" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Pressure</div>
                <div className="quad-value">{data.block2.item1}</div>
              </div>
            </div>
          </div>

          <div className="quadrant top-right">
            <div className="quad-content">
              <div className="quad-text">
                <div className="quad-header">Sunrise & Sunset</div>
                <div className="quad-value">{data.block2.item2}</div>
              </div>
            </div>
          </div>

          <div className="quadrant bottom-left">
            <div className="quad-content">
              <img src="./public/display/visibility.svg" alt="Visibility Icon" className="quad-icon" />
              <div className="quad-text">
                <div className="quad-header">Visibility</div>
                <div className="quad-value">{data.block2.item3}</div>
              </div>
            </div>
          </div>

          <div className="quadrant bottom-right">
            <div className="quad-content">
              <img src="./public/display/cloudcover.svg" alt="Cloud Cover Icon" className="quad-icon" />
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
