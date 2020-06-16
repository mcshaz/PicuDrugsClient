// note in current form will intentionally not parse dates < 1000 AD
export function parseDateUtc0(yyyy: string, mm: string, dd: string) {
  const yr = Number(yyyy);
  // double negative below is to exclude NaN
  if (!(yr >= 1000)) {
    return null;
  }
  const m = Number(mm) - 1;
  const d = Number(dd);
  const timestamp = new Date(yr, m, d);
  if (timestamp.getFullYear() !== yr || timestamp.getMonth() !== m || timestamp.getDate() !== d) {
    return null;
  }
  timestamp.setMinutes(-timestamp.getTimezoneOffset());
  return timestamp;
}

export function ymdFormat(d: Date) {
  return [d.getFullYear().toString().padStart(4, '0'),
    (d.getMonth() + 1).toString().padStart(2, '0'),
    d.getDate().toString().padStart(2, '0')].join('-');
}

export function dmyFormat(dt: Date) {
  return dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear();
}

export function dateInRange(dt: Date | null, min: Date | null, max: Date | null) {
  return dt && (!min || dt >= min) && (!max || dt <= max);
}

export const shortFormatter = new Intl.DateTimeFormat(navigator.languages as string[],
  {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

export const dateOrder = shortFormatter.formatToParts(new Date(1974, 2, 28))
  .map((p) => p.type === 'literal' ? p.value : p.type, [] as string[]);
