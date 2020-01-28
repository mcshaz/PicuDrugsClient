
import { RuleParamSchema, ValidationRuleSchema } from 'vee-validate/dist/types/types';

const isEmptyArray = (v: any) => Array.isArray(v) && v.length === 0;

const testEmpty = (value: any) =>
  isEmptyArray(value) || [false, null, undefined].includes(value) || !String(value).trim().length;

export const requiredIfEmpty: ValidationRuleSchema = {
  params: [{
    name: 'target',
    isTarget: true,
  }] as RuleParamSchema[],
  validate(value: any, { target }: Record<string, any>) {
    const isTargetEmpty = testEmpty(target);
    return {
      valid: isTargetEmpty ? !testEmpty(value) : true,
      required: isTargetEmpty,
    };
  },
  message: 'The {_field_} field is required if {target} is not provided',
  computesRequired: true,
};
