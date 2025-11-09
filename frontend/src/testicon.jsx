import React from 'react';
import './App.css'

export default function IconTest() {
  return (
    <div>
      <img src="./public/day.svg" alt="Day icon" />
      <img src="./public/team.svg" alt="Night icon" />
      <img src="./public/rain.svg" alt="Rain icon" />
      <img src="./public/snow.svg" alt="Snow icon" />
      <img src="./public/thunder.svg" alt="Thunder icon" />
      <img src="./public/fog.svg" alt="Fog icon" />
      <img src="./public/cloud.svg" alt="Cloud icon" />
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import './App.css'

// function Weather() {
//   const [current, setCurrent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('http://localhost:8000/current')
//       .then(res => res.json())
//       .then(data => {
//         setCurrent(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error fetching weather:', err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (!current) return <div>No data available</div>;

//   // Helper function to render objects/arrays
//   const renderValue = (value) => {
//     if (value === null || value === undefined) return 'N/A';

//     if (typeof value === 'object') {
//       if (Array.isArray(value)) {
//         // Render array elements as list items
//         return (
//           <ul>
//             {value.map((item, idx) => (
//               <li key={idx}>{JSON.stringify(item)}</li>
//             ))}
//           </ul>
//         );
//       }

//       // Render object key/value pairs as list
//       return (
//         <ul>
//           {Object.entries(value).map(([k, v]) => (
//             <li key={k}>
//               <strong>{k}:</strong> {String(v)}
//             </li>
//           ))}
//         </ul>
//       );
//     }

//     // Primitive types
//     return String(value);
//   };

//   return (
//     <div className="mainbody">
//       <h2>Current Weather Data</h2>
//       <ul className="textbody">
//         {Object.entries(current).map(([key, value]) => (
//           <li key={key}>
//             <strong>{key}:</strong> {renderValue(value)}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Weather;