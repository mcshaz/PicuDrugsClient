import { ValidationRuleSchema } from 'vee-validate/dist/types/types';

export const maxYears = 122;

export const defaultSim = 'SIM0000';

export const exactLength: ValidationRuleSchema = {
  validate(value, { length }) {
    // eslint-disable-next-line eqeqeq
    return value.length == length;
  },
  params: ['length'],
  message: 'The {_field_} field must be exactly {length} characters long',
};

export const nhiRegex: ValidationRuleSchema = {
  validate(value: string) {
    return /^([A-HJ-NP-Z]{3}\d{4}|SIM0000)$/.test(value);
  },
  // eslint-disable-next-line quotes
  message: "Must be 3 letters (NO 'I's or 'O's) followed by 4 numbers",
};

export const nhiChecksum: ValidationRuleSchema = {
  validate(value: string) {
    const alphaLookup = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const checkSum = parseInt(value.slice(-1), 10);
    value = value.slice(0, -1).toUpperCase();
    let cum = 0;
    let multiplier = value.length + 1;
    for (const c of value) {
      let val = parseInt(c, 10);
      if (Number.isNaN(val)) {
        val = alphaLookup.indexOf(c) + 1;
      }
      cum += val * multiplier--;
    }
    const modulus = cum % 11;
    return modulus === 1
      ? checkSum === 0
      : (checkSum === 11 - modulus);
  },
  message: 'A letter or number is mistyped',
};
