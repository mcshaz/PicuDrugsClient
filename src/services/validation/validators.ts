import { ValidationRuleSchema } from 'vee-validate/dist/types/types';
import { shortFormatter } from '@/services/utilities/dateHelpers';
import { languages } from '@/services/utilities/localisation';

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
    return /^([A-HJ-NP-Z]{3}\d{4}|SIM00\d{2})$/.test(value);
  },
  // eslint-disable-next-line quotes
  message: "Must be 3 letters (NO 'I's or 'O's) followed by 4 numbers",
};

export const nhiChecksum: ValidationRuleSchema = {
  validate(value: string) {
    if (/^SIM00\d{2}$/.test(value)) { return true; }
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
    return modulus <= 1
      ? checkSum === 0
      : (checkSum === 11 - modulus);
  },
  message: 'A letter or number is mistyped',
};

function localeString(value: Date | string, includeTime = false) {
  const limit = value instanceof Date
    ? value
    : new Date(value);
  return includeTime
    ? limit.toLocaleDateString(languages as string[])
    : shortFormatter.format(limit);
}

function makeComparable(value: any) {
  return isNaN(value)
    ? Date.parse(value)
    : +value;
}

export const before: ValidationRuleSchema = {
  params: ['limit', 'included', 'displayTime'],
  validate(value, { limit, included }: Record<string, any> = {}) {
    value = makeComparable(value);
    limit = makeComparable(limit);
    return included === false
      ? value < limit
      : value <= limit;
  },
  message(fieldName, placeholders) {
    return `The ${fieldName} field must be ${placeholders!.included === false ? '' : 'on or '}before ${localeString(placeholders!.limit, placeholders!.displayTime)}`;
  },
};

export const after: ValidationRuleSchema = {
  params: ['limit', 'included', 'displayTime'],
  validate(value, { limit, included }: Record<string, any> = {}) {
    value = makeComparable(value);
    limit = makeComparable(limit);
    return included === false
      ? value > limit
      : value >= limit;
  },
  message(fieldName, placeholders) {
    return `The ${fieldName} field must be ${placeholders!.included === false ? '' : 'on or '}after ${localeString(placeholders!.limit, placeholders!.displayTime)}`;
  },
};
