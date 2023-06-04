import isNumber from 'is-number';

export function throwErrorIfNotNumber(value) {
  if (!isNumber(value)) throw new Error('not a number');
}
