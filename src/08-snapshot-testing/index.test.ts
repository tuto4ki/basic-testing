import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const arr = [1];
    const list = {
      value: 1,
      next: {
        value: null,
        next: null,
      },
    };
    expect(generateLinkedList(arr)).toStrictEqual(list);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const arr = [1, 2];
    const list = generateLinkedList(arr);
    expect(list).toMatchSnapshot();
  });
});
