// Default Avatar Generator for Marketplace Users

export function getDefaultAvatar(gender?: string, name?: string): string {
  const cleanGender = (gender || '').toLowerCase().trim();
  const cleanName = (name || '').trim();

  // Color schemes
  let bgHex = '2563eb'; // Default blue
  let iconColor = 'ffffff';

  if (cleanGender === 'female' || cleanGender === 'f') {
    bgHex = 'ec4899'; // Pink/Rose
  } else if (cleanGender === 'male' || cleanGender === 'm') {
    bgHex = '3b82f6'; // Bright Blue
  } else {
    bgHex = '6366f1'; // Indigo
  }

  // Get initials if name is available
  if (cleanName) {
    const parts = cleanName.split(/\s+/).filter(Boolean);
    let initials = '';
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }
    if (initials) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="64" fill="#${bgHex}"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#${iconColor}" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700">${initials}</text>
      </svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }
  }

  // Fallback SVG icon for male / female / neutral
  if (cleanGender === 'female' || cleanGender === 'f') {
    const femaleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="64" fill="#ec4899"/>
      <path fill="#ffffff" d="M64 24c-13.25 0-24 10.75-24 24 0 11.23 7.72 20.65 18 23.25V80H48v12h10v12h12V92h10V80H66V71.25C76.28 68.65 84 59.23 84 48c0-13.25-10.75-24-24-24zm0 12c6.63 0 12 5.37 12 12s-5.37 12-12 12-12-5.37-12-12 5.37-12 12-12z"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(femaleSvg)}`;
  } else if (cleanGender === 'male' || cleanGender === 'm') {
    const maleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="64" fill="#3b82f6"/>
      <circle cx="64" cy="46" r="22" fill="#ffffff"/>
      <path fill="#ffffff" d="M36 102c0-15.46 12.54-28 28-28s28 12.54 28 28v2H36v-2z"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(maleSvg)}`;
  }

  // Neutral SVG
  const neutralSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="64" fill="#6366f1"/>
    <circle cx="64" cy="46" r="22" fill="#ffffff"/>
    <path fill="#ffffff" d="M36 102c0-15.46 12.54-28 28-28s28 12.54 28 28v2H36v-2z"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(neutralSvg)}`;
}

export function getProfileAvatarUrl(photoUrl?: string | null, gender?: string, name?: string): string {
  if (photoUrl && photoUrl.trim() !== '' && !photoUrl.includes('picsum.photos')) {
    return photoUrl;
  }
  return getDefaultAvatar(gender, name);
}
