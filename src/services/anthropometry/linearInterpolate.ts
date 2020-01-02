export type xy = [number, number];
export function linearInterpolate(xy1: xy, xy3: xy, x2: number) {
  return (x2 - xy1[0]) * (xy3[1] - xy1[1]) / (xy3[0] - xy1[0]) + xy1[1];
}
