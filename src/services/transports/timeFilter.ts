export function timeFilter(minutes: number, twoDigitHrs = false) {
  const hr = Math.floor(minutes / 60);
  const min = minutes - hr * 60;
  return hr.toString().padStart(twoDigitHrs ? 2 : 1, '0') + ':' + min.toString().padStart(2, '0');
}
