/**
 * Parse float as a number
 * 
 * @param value Value to parse
 */
export function parseFloat(value : any) {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      .test(value))
      return Number(value)
    return NaN
}
