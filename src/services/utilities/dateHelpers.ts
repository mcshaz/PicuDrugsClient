import { languages } from '@/services/utilities/localisation';
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

const shortFormatter = new Intl.DateTimeFormat(languages as string[],
  {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

function remove8206(txt: string) {
  let returnVar = '';
  for (let i = 0; i < txt.length; ++i) {
    if (txt.charCodeAt(i) !== 8206) {
      returnVar += txt.charAt(i);
    }
  }
  return returnVar;
}

let doesformatterAdd8206!: boolean; // weird IE thing gives charCode 8206 as 1st element

let dateOrder: string[];
if (typeof shortFormatter.formatToParts === 'function') {
  doesformatterAdd8206 = false;
  dateOrder = shortFormatter.formatToParts(0)
    .map((p) => p.type === 'literal' ? p.value : p.type, [] as string[]);
} else { // not supported ie11 - this is a hack which will only support {calendar: 'gregory', numberingSystem: 'latn'};
  const egDate = new Date(1984, 11, 30);
  const formatted = shortFormatter.format(egDate);
  doesformatterAdd8206 = formatted.indexOf(String.fromCharCode(8206)) !== -1;
  dateOrder = formatted.replace(egDate.getFullYear().toString(), 'year')
    .replace((egDate.getMonth() + 1).toString(), 'month')
    .replace(egDate.getDate().toString(), 'day')
    .match(/(year|month|day|\W+)/g)!
    .reduce((accum, txt) => {
      txt = remove8206(txt);
      if (txt) {
        accum.push(txt);
      }
      return accum;
    }, [] as string[]);
}

export function fixIE11Format(dt: Date | null, formatter = shortFormatter) {
  if (!dt) {
    return '';
  }
  if (doesformatterAdd8206) {
    return remove8206(formatter.format(dt));
  }
  return formatter.format(dt);
}

export { dateOrder, shortFormatter };
