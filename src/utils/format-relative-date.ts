export function formatRelativeDate(iso: string | null | undefined): string {
  if (!iso) return 'Never played';

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Never played';

  const now = Date.now();
  const diffMs = now - then;
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diffMs / day);

  if (days < 0) return 'Upcoming';
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return '1 month ago';
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  if (days < 730) return '1 year ago';
  return `${Math.floor(days / 365)} years ago`;
}
