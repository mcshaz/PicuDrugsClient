export const enum altitudeMeasures { metres, feet }
export const enum pressureMeasures { kpa, mmhg, atm }
export function pressureInAtm(altitude: number, measure: altitudeMeasures) {
  if (measure === altitudeMeasures.feet) {
    altitude *= 0.3048;
  }
  return Math.pow(1 - 2.25577e-5 * altitude, 5.25588);
}

export function equivalentFiO2ForPAO2(priorFiO2: number, pressureAtm: number, co2 = 0.0526, measure: pressureMeasures = pressureMeasures.atm) {
  switch (measure) {
    case pressureMeasures.kpa:
      co2 *= 0.00986923;
      break;
    case pressureMeasures.mmhg:
      co2 *= 0.00131579;
      break;
  }
  return priorFiO2 * (3.7526316 + co2) / (4 * pressureAtm - 0.2473684 + co2);
}
/*
export function maxAltitude(priorFiO2: number, co2: number = 0.0526, measure: altitudeMeasures) {
  const pres = priorFiO2 * 0.938158 - co2 * (1 - 0.2 * priorFiO2) / 0.8 + 0.061842 + co2 ;
  const altMetres =  (1 - Math.pow(pres, 0.1902630958)) * 0.44330760671e5;
  if (measure === altitudeMeasures.feet) {
    return altMetres / 0.3048;
  }
  return altMetres;
}
*/
/*
export function equivalentFiO2ForPO2(pressureAtm: number) {
  return 0.938 / (pressureAtm - 0.062);
}

function aaGradient(fiO2: number = 0.21, pressureAtm: number = 1, co2: number = 0.0526, measure: pressureMeasures = pressureMeasures.atm) {
  switch (measure) {
    case pressureMeasures.kpa:
      co2 *= kpaToAtm;
      break;
    case pressureMeasures.mmhg:
      co2 *= mmHgToAtm;
      break;
  }
  return fiO2 * (pressureAtm - 0.0618421) - co2 * (1 - 0.2 * fiO2) / 0.8;
}

var  a = pressureInAtm(6000, lengthMeasures.feet)
console.log(`at 6000 feet ${a} atm`)
var fio2 = 0.21
var equiv = equivalentFiO2ForPAO2(fio2, a)
var aaSea = aaGradient(fio2)
var aaCabin = aaGradient(equiv, a)
console.log(`sea ${aaSea} == ${aaCabin} cabin`)
*/
