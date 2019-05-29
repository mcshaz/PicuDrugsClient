export function parseDate(yyyy: string, mm: string, dd: string) {
    const yr = parseFloat(yyyy);
    const m = parseFloat(mm) - 1;
    const d = parseFloat(dd);
    const timestamp = new Date(yr, m, d);
    if (timestamp.getFullYear() !== yr || timestamp.getMonth() !== m || timestamp.getDate() !== d) {
        return null;
    }
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

export const isMonthFirst = (() => {
    const indexOf = (search: string, searchFor: number) =>
                        search.search(new RegExp('\\b' + searchFor.toString().padStart(2, '0') + '\\b'));
    const mm = 3;
    const dd = 28;
    const testDate = new Date(1974, mm - 1, dd);
    const dateStr = testDate.toLocaleDateString(void 0, { year: 'numeric', month: '2-digit', day: '2-digit' });
    return indexOf(dateStr, mm) < indexOf(dateStr, dd);
})();
