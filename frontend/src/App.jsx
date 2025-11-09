import React, { useState, useEffect } from "react";
import WeatherDiv from "./components/WeatherDiv.jsx";
import Background from "./components/Background.jsx";

function App() {
  <div style={{ position: 'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'black', zIndex:-2 }} />

  const [data, setData] = useState({
    block1: {
      item1: <>Loading...<br />Loading...</>, // wind speed/direction
      item2: "Loading...",
      item3: "Loading...",
      item4: "Loading...",
    },
    block2: {
      item1: "Loading...",
      item2: "Loading...",
      item3: "Loading...",
      item4: "Loading...",
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/current")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })

      .then((json) => {

        console.log("Raw API data:", json);

        const mappedData = {
          block1: {
            item1: (
              <>
                {json.wind?.speed ?? "N/A"} mp/h<br />
                {json.wind?.direction ?? "N/A"}°
              </>
            ),
            item2: `${json.feelsLike ?? "N/A"}°`,
            item3: `${json.humidity ?? "N/A"}%`,
            item4: `${json.precipitation ?? 0}%`,
          },
          block2: {
            item1: `${json.pressure ?? "N/A"} inHg`,
            item2: `${json.sunrise ?? "N/A"} / ${json.sunset ?? "N/A"}`,
            item3: `${json.visibility ?? "N/A"} NM`,
            item4: `${json.cloudCoverage ?? "N/A"}%`,
          },
        };

        setData(mappedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching weather data:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <Background />
      {error && <div style={{ color: "red" }}>Error loading weather data</div>}
      <WeatherDiv data={data} />
    </div>
  );
}

export default App;
