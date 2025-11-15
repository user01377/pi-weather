export function GetCustomIcon({ iconUrl, alt, className }) {
  const lower = (iconUrl || "").toLowerCase();
  let src = "/day.svg"; 

  const pickWeightedNightIcon = () => {
    const r = Math.random();
    return r < 0.8 ? "/moon.svg" : "/team.svg"; 
  };

  if (lower.includes("snow")) src = "/snow.svg";
  else if (lower.includes("thunder")) src = "/thunder.svg";
  else if (lower.includes("rain")) src = "/rain.svg";
  else if (lower.includes("fog")) src = "/foggy.svg";
  else if (lower.includes("cloud")) src = "/cloudy.svg";
  else if (lower.includes("night")) src = pickWeightedNightIcon();
  
  else console.warn(`No matching icon found for: "${iconUrl}"`); 

  return <img src={src} alt={alt || "weather icon"} className={className} />;
}
