import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const strTest = 'enter value';
    const data = await resolveValue(strTest);
    expect(data).toBe(strTest);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'enter value';
    try {
      throwError(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(errorMessage);
      }
    }
  });

  test('should throw error with default message if message is not provided', () => {
    const errorMessage = 'Oops!';
    try {
      throwError();
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(errorMessage);
      }
    }
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const errorMessage = 'This is my awesome custom error!';
    try {
      throwCustomError();
    } catch (error) {
      if (error instanceof MyAwesomeError) {
        expect(error.message).toBe(errorMessage);
      }
    }
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const errorMessage = 'This is my awesome custom error!';
    await expect(rejectCustomError())
      .rejects.toBeInstanceOf(MyAwesomeError)
      .catch((err) => {
        expect(err.message).toBe(errorMessage);
      });
  });
});
