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
  