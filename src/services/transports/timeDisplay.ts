export function timeDisplay(minutes: number) {
  const hr = Math.floor(minutes / 60);
  const toHtml = (i: 'h' | 'm' | 's') => `<small class="text-muted">${i}</small>`;
  minutes = minutes - hr * 60;
  const minStr = minutes.toFixed().padStart(2, '0') + toHtml('m');
  return hr > 0
    ? hr + toHtml('h') + ' ' + minStr
    : minStr;
}
