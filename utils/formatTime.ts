// utils/formatTime.ts

export function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${paddedMinutes} ${ampm}`;
  } catch {
    return '';
  }
}
