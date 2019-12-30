import { helpers } from 'vuelidate/lib/validators'

export function exactLength (length: number) {
  return helpers.withParams({ type: 'exactLength', length },
    (value: string) => !helpers.req(value) || (value.length === length))
}
