// parses time string from api back into a comparable time to Date()
export function parseTimeToDate(timeStr) {
  if (!timeStr) return new Date(); // fallback to now

  const [time, modifier] = timeStr.split(" ");
  if (!time || !modifier) return new Date();

  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// returns true if it is currently night, false if day
export function isNightNow(sunriseStr, sunsetStr) {
  const now = new Date();
  const sunriseDate = parseTimeToDate(sunriseStr);
  const sunsetDate = parseTimeToDate(sunsetStr);

  return now < sunriseDate || now >= sunsetDate;
}
