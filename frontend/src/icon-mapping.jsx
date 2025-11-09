function getCustomIcon(iconUrl) {
    const lower = iconUrl.toLowerCase();
  
    if (lower.includes('snow')) return '/assets/snow.svg';
    if (lower.includes('thunder')) return '/assets/thunder.svg';
    if (lower.includes('rain')) return '/assets/rain.svg';
    if (lower.includes('fog')) return '/assets/fog.svg';
    if (lower.includes('cloud')) return '/assets/cloud.svg';
    if (lower.includes('night')) return '/assets/team.svg';

    return '/assets/day.svg';
  }
  