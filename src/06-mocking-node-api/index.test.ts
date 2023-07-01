import fs from 'fs';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const ms = 1000;
    const spyOne = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    doStuffByTimeout(callback, ms);

    expect(spyOne).toHaveBeenCalledTimes(1);
    expect(spyOne).toHaveBeenLastCalledWith(callback, ms);
  });

  test('should call callback only after timeout', () => {
    const ms = 1000;
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    doStuffByTimeout(callback, ms);

    expect(callback).not.toBeCalled();
    jest.runOnlyPendingTimers();
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);

    jest.spyOn(global, 'setTimeout').mockRestore();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const ms = 1000;
    const spyOne = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, ms);

    expect(spyOne).toHaveBeenCalledTimes(1);
    expect(spyOne).toHaveBeenLastCalledWith(callback, ms);

    jest.spyOn(global, 'setInterval').mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const ms = 1000;
    const timeCall = 10;
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, ms);

    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(ms * timeCall);
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(timeCall);

    jest.spyOn(global, 'setInterval').mockRestore();
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = '../text.txt';
    const spyOne = jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToFile);

    expect(spyOne).toHaveBeenLastCalledWith(__dirname, pathToFile);

    jest.spyOn(path, 'join').mockRestore();
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = '../text1.txt';
    const files = { '../text.txt': 'content file' };
    jest.spyOn(path, 'join').mockImplementation(() => pathToFile);
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((path) => (path.toString() in files ? true : false));
    await expect(readFileAsynchronously(pathToFile)).resolves.toBeNull();

    jest.spyOn(path, 'join').mockRestore();
    jest.spyOn(fs, 'existsSync').mockRestore();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = '../text.txt';
    const content = 'content file';
    jest.spyOn(path, 'join').mockImplementation(() => pathToFile);
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() => Promise.resolve(content));
    await expect(readFileAsynchronously(pathToFile)).resolves.toBe(content);

    jest.spyOn(path, 'join').mockRestore();
    jest.spyOn(fs, 'existsSync').mockRestore();
    jest.spyOn(fs.promises, 'readFile').mockRestore();
  });
});
