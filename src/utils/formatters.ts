/** Get current ISO 8601 timestamp */
export function now(): string {
  return new Date().toISOString();
}

/** Format a date string for display (e.g., "Mar 15, 2026") */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Format monster speed object to readable string (e.g., "30 ft., fly 60 ft.") */
export function formatSpeed(speed: Record<string, string>): string {
  return Object.entries(speed)
    .map(([type, value]) => (type === 'walk' ? value : `${type} ${value}`))
    .join(', ');
}
