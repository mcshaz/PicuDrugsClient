export function timeFilter(minutes: number) {
  const hr = Math.floor(minutes / 60);
  const min = minutes - hr * 60;
  return hr + ':' + min.toString().padStart(2, '0');
}
