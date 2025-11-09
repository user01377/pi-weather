/**
 * Parse a standard "hh:mm AM/PM" string into a Date object for today
 */
export function parseTimeString(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
  
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
  
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
  }
  
/**
 * Compute sun trajectory ratio
 * Returns a number between 0 and 1 representing sun's progress between sunrise and sunset
 * If before sunrise, ratio < 0; if after sunset, ratio > 1
 */
export function getSunRatio(sunriseStr, sunsetStr, now = new Date()) {
const sunrise = parseTimeString(sunriseStr);
const sunset = parseTimeString(sunsetStr);

const totalDayMs = sunset - sunrise; // total milliseconds of daylight
const elapsedMs = now - sunrise;     // milliseconds since sunrise

return elapsedMs / totalDayMs; // ratio: <0 before sunrise, >1 after sunset
}

/**
 * Optional helper: clamp ratio between 0 and 1
 */
export function getClampedSunRatio(sunriseStr, sunsetStr, now = new Date()) {
const ratio = getSunRatio(sunriseStr, sunsetStr, now);
return Math.max(0, Math.min(1, ratio));
}
