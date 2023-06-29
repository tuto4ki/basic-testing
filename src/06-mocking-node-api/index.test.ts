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
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    doStuffByTimeout(callback, ms);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(callback, ms);
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
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, ms);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(callback, ms);
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
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = '../text.txt';
    jest.spyOn(path, 'join').mockImplementation(() => pathToFile);

    await readFileAsynchronously(pathToFile);

    expect(path.join).lastReturnedWith(pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = '../text1.txt';
    const files = { '../text.txt': 'content file' };
    jest.spyOn(path, 'join').mockImplementation(() => pathToFile);
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((path) => (path.toString() in files ? true : false));
    await expect(readFileAsynchronously(pathToFile)).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    /**
     * 
     * interface IPathFile {
        [index: string]: string;
      }
     */
    const pathToFile = '../text.txt';
    const spyOne = jest.fn();
    fs.promises.readFile = spyOne;
    const files = { [pathToFile]: 'content file' };
    jest.spyOn(path, 'join').mockImplementation(() => pathToFile);
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((path) => (path.toString() in files ? true : false));
    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(async (path) => path && files[pathToFile]);
    await expect(readFileAsynchronously(pathToFile)).resolves.toBe(
      files[pathToFile],
    );
  });
});
