import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    __esModule: true,
    ...originalModule,
    mockOne: () => 'mocked foo',
    mockTwo: () => 'mocked bar',
    mockThree: () => 'mocked baz',
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    expect(mockOne()).toBe('mocked foo');
    expect(mockTwo()).toBe('mocked bar');
    expect(mockThree()).toBe('mocked baz');
  });

  test('unmockedFunction should log into console', () => {
    const spyOne = jest.spyOn(global.console, 'log');
    unmockedFunction();
    expect(spyOne).toHaveBeenCalledWith('I am not mocked');
    jest.spyOn(global.console, 'log').mockRestore();
  });
});
