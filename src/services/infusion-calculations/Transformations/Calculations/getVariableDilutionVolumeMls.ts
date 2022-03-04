const minVariableWeight = 30.0;
const maxVolume = 60.0;
export function getVariableDilutionVolumeMls(ptWeight: number): number {
  if (ptWeight < minVariableWeight) {
    throw new Error('ptWeight < ' + minVariableWeight);
  }
  let num: number = 3333.333333333333 / ptWeight;
  if (num > maxVolume) {
    num = num / 2.0;
  }
  return num;
}
