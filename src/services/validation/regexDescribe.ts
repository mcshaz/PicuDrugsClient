import { helpers } from 'vuelidate/lib/validators'
export function regexDescribe (name: string, rx: RegExp, description: string) {
  return helpers.withParams({ type: name, description }, (value: string) => !helpers.req || rx.test(value))
}
