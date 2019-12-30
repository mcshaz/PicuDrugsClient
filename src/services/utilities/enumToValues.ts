
import { sortByAnyProp } from './sortByProp'

export interface ISelectOption { text: string; value: number; }
export enum enumValueOptions { sortOnText = 0, sortOnValue = 1, splitCamelCase = 2, capitalise = 4 }

// tslint:disable-next-line:no-bitwise
export function enumToValues (enm: any, options: enumValueOptions = enumValueOptions.sortOnText | enumValueOptions.splitCamelCase | enumValueOptions.capitalise): ISelectOption[] {
  // the keys method returns the enumerable STRING properties only
  const returnVar = sortByAnyProp(Object.keys(enm).map((k) => ({ text: k, value: enm[k] as number })),
    // tslint:disable-next-line: no-bitwise
    (options & enumValueOptions.sortOnText) ? 'text' : 'value')
  // note running through loop twice below - given size of enums probably not worth performance optimisation here
  // tslint:disable-next-line:no-bitwise
  if (options & enumValueOptions.splitCamelCase) {
    const rgx = /([a-z])([A-Z])/g
    returnVar.forEach((o) => o.text = o.text.replace(rgx, '$1 $2'))
  }
  // tslint:disable-next-line:no-bitwise
  if (options & enumValueOptions.capitalise) {
    returnVar.forEach((o) => o.text = o.text[0].toUpperCase() + o.text.substring(1))
  }
  return returnVar
}
