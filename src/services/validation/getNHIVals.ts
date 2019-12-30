import { helpers } from 'vuelidate/lib/validators'

export const defaultSim = 'SIM0000'
export function getNHIVals () {
  return {
    nhiChars: helpers.regex('nhiChars', createNHIRx()),
    // exactLength: exactLength(defaultSim.length),
    nhiChecksum: helpers.withParams({ type: 'nhiChecksum' }, (val: string) => !helpers.req(val) || mod11check(val))
  }
}
function createNHIRx (ignoreCase: boolean = false, simNHI = defaultSim) {
  let allowedChars = 'A-HJ-NP-Z'
  if (ignoreCase) {
    allowedChars += allowedChars.toLowerCase()
    simNHI = simNHI.split('')
      .map((c) => isNaN(Number(c))
        ? `[${c}${c.toLowerCase()}]`
        : c)
      .join('')
  }
  allowedChars = '[' + allowedChars + ']'
  const returnVar = 'AAANNNC'
    .split('')
    .map((c) => {
      switch (c) {
        case 'A':
          return allowedChars
        case 'N':
        case 'C':
          return '\\d'
        default:
          return c
      }
    })
    .join('')
  return new RegExp(`^(${returnVar}|${simNHI})$`)
}

function mod11check (str: string) {
  const alphaLookup = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const checkSum = parseInt(str.slice(-1), 10)
  str = str.slice(0, -1).toUpperCase()
  let cum = 0
  let multiplier = str.length + 1
  for (const c of str) {
    let val = parseInt(c, 10)
    if (isNaN(val)) {
      val = alphaLookup.indexOf(c) + 1
    }
    cum += val * multiplier--
  }
  const modulus = cum % 11
  return modulus > 1
    ? (checkSum === 11 - modulus)
    : (modulus + checkSum === 11)
}
