// Shorten file name (for display purposes)
export const shortenFileName = (str: string | null | undefined) => {
  if (!str) return "image.jpg";
  if (str.length > 22) {
    return str.slice(0, 11) + "..." + str.slice(-11);
  }
  return str;
};

// Format file size into human-readable units (KB, MB, GB)
export const formatSizeUnits = (bytes: number | null | undefined) => {
  if (!bytes || bytes === 0) return "0 bytes";
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + " GB";
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes > 1) return bytes + " bytes";
  if (bytes === 1) return bytes + " byte";
  return "0 bytes";
};

// Format ISO date string (e.g. "2025-07-07T12:00:00Z") to "DD/MM/YY"
export const formatShortDate = (isoDate: string | null | undefined) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// Format ISO date string (e.g. "2025-07-07T04:01:00Z") to "HH:mm"
export const formatShortTime = (isoDate: string | null | undefined) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Format audio duration from milliseconds to MM:SS format
export const formatAudioDuration = (milliseconds: number): string => {
  if (!milliseconds || milliseconds <= 0) return "0:00";
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};