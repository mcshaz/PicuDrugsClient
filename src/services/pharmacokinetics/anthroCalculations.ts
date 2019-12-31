
export enum bsaFormulas { DuBois, Mosteller }
export interface IAnthroCalculation { description: string; formula: (...args: any[]) => number; katex: string[]; requiresMassKg?: boolean; requiresHeightCm?: boolean; requiresGender?: boolean; }

const anthroCalculations = new Map<string, IAnthroCalculation>();
anthroCalculations.set('body surface area (Mostellar)', {
  description: 'simplified (and most commonly used) BSA calculation',
  formula: bodySurfaceArea.bind(void 0, bsaFormulas.Mosteller),
  requiresMassKg: true,
  requiresHeightCm: true,
  katex: ['BSA=\\sqrt{\\frac{massKg * heightCm} { 3600 }}'],
});
anthroCalculations.set('body surface area (Du Bois, 1916)', {
  description: 'original BSA calculation',
  formula: bodySurfaceArea.bind(void 0, bsaFormulas.DuBois),
  requiresMassKg: true,
  requiresHeightCm: true,
  katex: ['BSA=0.007184*massKg^{0.425}*heightCm^{0.725}'],
});
anthroCalculations.set('ideal body mass', {
  description: 'The standard weight measurement in many clinical calculations, such as tidal volume (Pai and Paloucek 2000). Note: this formula is only an approximation, and is generally only applicable for people over 150 cm',
  formula: idealBodyMass,
  requiresHeightCm: true,
  requiresGender: true,
  katex: ['IBM_♂=49.9+0.89*(heightCm-152.4), heightCm>=152.4', 'IBM_♀=45.4+0.89*(heightCm-152.4), heightCm>=152.4'],
});
anthroCalculations.set('lean body mass', {
  description: 'Component of total body mass that excludes fat mass but includes fat in nonfat mass cell membranes, bone marrow and the central nervous system. (Green and Duffull, 2002)',
  formula: leanBodyMass,
  requiresMassKg: true,
  requiresHeightCm: true,
  requiresGender: true,
  katex: ['LBM_♂=1.1*massKg-0.0128*\\frac{massKg^2}{heightM^2}', 'LBM_♀=1.07*massKg-0.0148*\\frac{massKg^2}{heightM^2}'],
});
anthroCalculations.set('fat free mass', {
  description: 'Component of total body mass that does not include any fat mass (i.e. excludes fat in cell membranes, bone marrow etc.).',
  formula: fatFreeMass,
  requiresMassKg: true,
  requiresHeightCm: true,
  requiresGender: true,
  katex: ['FFM=\\frac{whs_{max} * heightM^2*massKg}{whs_{50}*heightM^2+massKg}', '\\text{female:}whs_{max}=37.99, whs_{50}=35.98', '\\text{male:}whs_{max}=42.92, whs_{50}=30.93'],
});
anthroCalculations.set('adjusted body mass', {
  description: 'Mass that normalizes non-ideal body mass to ideal body mass',
  formula: adjustedBodyMass,
  requiresMassKg: true,
  requiresHeightCm: true,
  requiresGender: true,
  katex: ['AdjBM = IBM + 0.4 * (massKg - IBM)'],
});
anthroCalculations.set('pharmakokinetic mass', {
  description: 'Mass used to predict fentanyl dosing.',
  formula: pharmakoKineticMass,
  requiresMassKg: true,
  katex: ['PkM = \\frac{52} {1 + \\frac{(196.4 * e^{-0.025} * massKg - 53.66)} {100}}'],
});
anthroCalculations.set('predicted body mass', {
  description: 'Mass that normalizes non-lean body mass to lean body mass with a sex specific factor',
  formula: predictedBodyMass,
  requiresMassKg: true,
  requiresHeightCm: true,
  requiresGender: true,
  katex: ['PredBM = LBM + f_{sex} * (massKg - LBM)', 'f_{sex} ♂ = 0.43, ♀ = 0.64'],
});

const massRx = /massKg/g;
const heightRx = /height([CM]m?)/g;
const prodRx = /\*/g;
const wrapPascalRx = /[A-Z][a-zA-Z]+/g;
const pascalRx = /[A-Z][a-z]*/g;
anthroCalculations.forEach((ac) => (ac.katex = ac.katex.map(preprocessKatex)));

export { anthroCalculations, applyAnthropometry };
type falsey = boolean | number | null | '';
function applyAnthropometry(calculation: IAnthroCalculation, massKg?: falsey, heightCm?: falsey, isMale?: falsey) {
  const requires = [!!calculation.requiresMassKg, !!calculation.requiresHeightCm, !!calculation.requiresGender];
  const args: Array<boolean | number> = [];
  for (let i = 1; i < 4; i++) {
    if (requires[i - 1]) {
      const t = typeof arguments[i];
      if (t === 'boolean' || (t === 'number' && arguments[i] > 0)) {
        args.push(arguments[i]);
      } else {
        return null;
      }
    }
  }
  return calculation.formula.apply(null, args);
}

function bodySurfaceArea(bsaFormula: bsaFormulas = bsaFormulas.Mosteller, massKg: number, heightCm: number) {
  switch (bsaFormula) {
    case bsaFormulas.DuBois:
      return 0.007184 * Math.pow(massKg, 0.425) * Math.pow(heightCm, 0.725);
    case bsaFormulas.Mosteller:
      return Math.sqrt(massKg * heightCm / 3600);
  }
  throw new Error('unknown BSA formula');
}
function idealBodyMass(heightCm: number, isMale: boolean) {
  const heightCut = 152.4;
  return (isMale ? 49.9 : 45.4) + (heightCm <= heightCut
    ? 0
    : ((heightCm - heightCut) * 0.89));
}
// Component of TBM that excludes fat mass but includes fat in nonfat mass cell membranes, bone marrow and the central nervous system.
function leanBodyMass(massKg: number, heightCm: number, isMale: boolean) {
  const bmi = massKg / Math.pow(heightCm / 100, 2);
  if (isMale) {
    return 1.1 * massKg - 0.0128 * bmi * massKg;
  }
  return 1.07 * massKg - 0.0148 * bmi * massKg;
}
// Component of TBM that does not include fat mass
function fatFreeMass(massKg: number, heightCm: number, isMale: boolean) {
  const whsMax = isMale ? 42.92 : 37.99;
  const whs50 = isMale ? 30.93 : 35.98;
  const htMSquare = Math.pow(heightCm / 100, 2);
  return whsMax * htMSquare * massKg / (whs50 * htMSquare + massKg);
}
function normalFatMass(fFat: number, massKg: number, heightCm: number, isMale: boolean) {
  const ffm = fatFreeMass(massKg, heightCm, isMale);
  return ffm + fFat * (massKg - ffm);
}
// Mass that normalizes non-ideal body mass to IBM
function adjustedBodyMass(massKg: number, heightCm: number, isMale: boolean) {
  const ibm = idealBodyMass(heightCm, isMale);
  return ibm + 0.4 * (massKg - ibm);
}
// Mass used to predict fentanyl dosing.
function pharmakoKineticMass(massKg: number) {
  return 52 / (1 + (196.4 * Math.exp(-0.025 * massKg) - 53.66) / 100);
}
// Mass that normalizes non-lean body mass to LBM with a sex specific factor, Fsex.
function predictedBodyMass(massKg: number, heightCm: number, isMale: boolean) {
  const fSex = isMale ? 0.43 : 0.64;
  const lbm = leanBodyMass(massKg, heightCm, isMale);
  return lbm + fSex * (massKg - lbm);
}

function preprocessKatex(katex: string) {
  katex = katex.replace(massRx, '\\text{mass}_\\text{kg}');
  katex = katex.replace(heightRx, (match, c1) => `\\text{height}_\\text{${c1.toLowerCase()}}`);
  katex = katex.replace(prodRx, '\\cdot ');
  katex = katex.replace(wrapPascalRx, (match) => `\\text{${match}}`);
  katex = katex.replace(pascalRx, (match) => match + '.');
  return katex;
}
