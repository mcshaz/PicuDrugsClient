import { SiPrefix } from './SiPrefix';
export const prefixes: ReadonlyArray<SiPrefix> = [
  new SiPrefix(0, ''),
  new SiPrefix(-3, 'milli'),
  new SiPrefix(-6, 'micro', 'µ'),
  new SiPrefix(-9, 'nano'),
  new SiPrefix(-12, 'pico'),
];
export function getPrefix(logVal: number): SiPrefix {
  return prefixes[logVal / -3];
}
