import { ValueType } from '../pages/Home';

export function arraysAreEqual<T extends ValueType>(valueTypes1: T[], valueTypes2: T[]): boolean {
  // check array length
  if (valueTypes1.length !== valueTypes2.length) {
    return false;
  }

  // compare objects in the arrays
  for (let i = 0; i < valueTypes1.length; i++) {
    const valueType1 = valueTypes1[i];
    const valueType2 = valueTypes2[i];

    // compare every key-value-pair in the objects
    for (const key in valueType1) {
      if (Object.prototype.hasOwnProperty.call(valueType1, key) && Object.prototype.hasOwnProperty.call(valueType2, key)) {
        if (valueType1[key] !== valueType2[key]) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  // all checks successful
  return true;
}

export function generateRandomNumber(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from) + from);
}
