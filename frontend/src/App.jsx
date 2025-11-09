import React from 'react';
import WeatherDiv from './components/WeatherDiv.jsx';
import Background from './components/Background.jsx';

function App() {
  const sampleData = {
    block1: {
      item1: "Temperature: 72°F",
      item2: "Humidity: 40%",
      item3: "Wind: 5 mph",
      item4: "Condition: Sunny",
    },
    block2: {
      item1: "Sunrise: 6:30 AM",
      item2: "Sunset: 7:45 PM",
      item3: "UV Index: 5",
      item4: "Visibility: 10 miles",
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