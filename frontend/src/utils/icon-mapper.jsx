import { useMemo } from "react";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000;
  }
  return hash / 1000;
}

export function GetCustomIcon({ iconUrl, alt, className }) {
  const lower = (iconUrl || "").toLowerCase();

  const src = useMemo(() => {
    let result = "/day.svg";

    const pickDeterministicNightIcon = () => {
      const h = hashString(lower); // 0–1 pseudo-random deterministic
      // console.log("Night hash:", h);
      const icon = h < 0.5 ? "/moon.svg" : "/team.png";
      // console.log("Chosen night icon:", icon);
      return icon;
    };

    if (lower.includes("snow")) result = "/snow.svg";

    else if (lower.includes("thunder")) result = "/thunder.svg";

    else if (lower.includes('night') && lower.includes('rain')) result = "/night-rain.svg";

    else if (lower.includes("rain")) result = "/rain.svg";

    else if (
      (lower.includes('night') && lower.includes('bkn')) ||
      (lower.includes('night') && lower.includes('ovc'))
    ) {
      result = "/night-cloudy.svg";
    }
    
    else if (
      lower.includes('bkn') ||
      lower.includes('ovc')
  ) {
    result = "/cloudy.svg";
}

    else if (lower.includes("night")) result = pickDeterministicNightIcon();
    
    // else console.warn(`Defaulting To Day Icon With: ${iconUrl}`);

    return result;
  }, [lower]);

  return <img src={src} alt={alt || "weather icon"} className={className} />;
}
