import React from 'react';
import WeatherDiv from './components/WeatherDiv.jsx';
import Background from './components/Background.jsx';

function App() {
  const sampleData = {
    block1: {
      item1: "5 mp/h (dir)",
      item2: "56°",
      item3: "99%",
      item4: "56%",
    },
    block2: {
      item1: "29.92 inHg",
      item2: "7:45 PM",
      item3: "10 NM",
      item4: "56%",
    },
  };

  return (
    <div className="app">
      <Background />
      <WeatherDiv data={sampleData} />
    </div>
  );
}

export default App;