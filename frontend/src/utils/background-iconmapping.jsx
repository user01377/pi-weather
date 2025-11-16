export const getWeatherKeyword = (iconUrl) => {
    if (!iconUrl) return 'clear';
  
    const lowerUrl = iconUrl.toLowerCase();
  
    if (lowerUrl.includes('snow')) return 'snow';
    if (lowerUrl.includes('tsra') || lowerUrl.includes('ts')) return 'storm';
    if (lowerUrl.includes('rain')) return 'rain';
    if (
        lowerUrl.includes('/few') ||
        lowerUrl.includes('/sct') ||
        lowerUrl.includes('/bkn') ||
        lowerUrl.includes('/ovc')
    ) {
        return 'cloud';
    }
    
    
    return 'clear'; // default
  };
  