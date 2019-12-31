import { integer, between } from 'vuelidate/lib/validators';
export const maxYears = 122;
export function getAgeVals() {
  return {
    years: { integer, between: between(0, maxYears) },
    months: { integer, between: between(0, 24) },
    days: { integer, between: between(0, 31) },
  };
}
export function getDOBVal(now?: Date) {
  if (now === void 0) {
    now = new Date();
    now.setHours(0, 0, 0, 0);
  }
  const earliest = new Date(now);
  earliest.setFullYear(earliest.getFullYear() - maxYears);
  return { between: between(earliest, now) };
}
