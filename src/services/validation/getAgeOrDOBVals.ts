import { integer, between } from 'vuelidate/lib/validators';
export const maxYears = 122;
export function getAgeVals() {
    return {
        ageYears: { integer, between: between(0, maxYears) },
        ageMonths: { integer, between: between(0, 24) },
        ageDays: { integer, between: between(0, 31) },
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
