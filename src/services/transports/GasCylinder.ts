export class GasCylinder {
  constructor(readonly litres: number, readonly use = '', readonly barFull = 153) {
  }
}

export const cylinderSizes = Object.freeze({
  AA: new GasCylinder(160),
  A: new GasCylinder(440, 'std portable'),
  AD: new GasCylinder(560),
  BP: new GasCylinder(110, 'small nitric oxide'),
  D: new GasCylinder(1490, 'ambulance'),
  D2: new GasCylinder(1570),
  G: new GasCylinder(7290),
  M122: new GasCylinder(3455, 'fixed-wing'),
  ME: new GasCylinder(1600, 'rotary-wing')
});

export const pressureToKpa = {
  psi: 6.89476,
  bar: 100,
};
