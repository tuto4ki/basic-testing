// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const sum = simpleCalculator({ a: 5, b: 4, action: Action.Add });
    expect(sum).toEqual(9);
  });

  test('should subtract two numbers', () => {
    const sub = simpleCalculator({ a: 5, b: 4, action: Action.Subtract });
    expect(sub).toEqual(1);
  });

  test('should multiply two numbers', () => {
    const multiply = simpleCalculator({ a: 5, b: 4, action: Action.Multiply });
    expect(multiply).toEqual(20);
  });

  test('should divide two numbers', () => {
    const divide = simpleCalculator({ a: 20, b: 4, action: Action.Divide });
    expect(divide).toEqual(5);
  });

  test('should exponentiate two numbers', () => {
    const exp = simpleCalculator({ a: 2, b: 4, action: Action.Exponentiate });
    expect(exp).toEqual(16);
  });

  test('should return null for invalid action', () => {
    const exp = simpleCalculator({
      a: 'num',
      b: '4',
      action: Action.Exponentiate,
    });
    expect(exp).toEqual(null);
  });

  test('should return null for invalid arguments', () => {
    const exp = simpleCalculator({
      a: 4,
      b: 5,
      action: '%',
    });
    expect(exp).toEqual(null);
  });
});
