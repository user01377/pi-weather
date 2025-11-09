import React from "react";
import "../styles/weatherdivstyle.css";

export default function WeatherDiv({ data }) {
  return (
    <div className="weather-wrapper">
      <div className="weather-container">

        {/* First rectangle */}
        <div className="weather-block">
          <div className="header">AIR CONDITIONS</div>

          <div className="quadrant">
            <div className="quad-header">Temperature</div>
            <div className="quad-value">{data.block1.item1}</div>
          </div>

          <div className="quadrant">
            <div className="quad-header">Humidity</div>
            <div className="quad-value">{data.block1.item2}</div>
          </div>

          <div className="quadrant">
            <div className="quad-header">Wind</div>
            <div className="quad-value">{data.block1.item3}</div>
          </div>

          <div className="quadrant">
            <div className="quad-header">Visibility</div>
            <div className="quad-value">{data.block1.item4}</div>
          </div>
        </div>

        {/* Second rectangle */}
        <div className="weather-block">
          <div className="header">MISC INFO</div>

          <div className="quadrant">
            <div className="quad-header">Pressure</div>
            <div className="quad-value">{data.block2.item1}</div>
          </div>

          <div className="quadrant">
            <div className="quad-header">UV Index</div>
            <div className="quad-value">{data.block2.item2}</div>
          </div>

          <div className="quadrant">
            <div className="quad-header">Dew Point</div>
            <div className="quad-value">{data.block2.item3}</div>
          </div>

          <div className="quadrant">
            <div className="quad-header">Cloud Cover</div>
            <div className="quad-value">{data.block2.item4}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
