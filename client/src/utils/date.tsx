export const formatIsoToShortUS = (iso: string): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',   // "Aug"
    day: 'numeric',   // 27
    year: 'numeric',  // 2024
  }).format(new Date(iso));
