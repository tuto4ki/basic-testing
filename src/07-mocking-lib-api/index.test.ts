import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.mock('axios');
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.unmock('axios');
  });

  test('should create instance with provided base url', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.create = jest.fn(() => axios);
    mockedAxios.get = jest
      .fn()
      .mockResolvedValue(Promise.resolve({ data: 'data' }));
    await throttledGetDataFromApi('path');
    jest.runAllTimers();

    const getData = mockedAxios.create.mock.calls[0]?.[0];
    expect(mockedAxios.create).toBeCalled();
    expect(getData).toEqual({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.create = jest.fn(() => axios);
    mockedAxios.get = jest
      .fn()
      .mockResolvedValue(Promise.resolve({ data: 'data' }));

    await throttledGetDataFromApi('path');
    jest.runAllTimers();

    const getData = mockedAxios.get.mock.calls[0]?.[0];
    expect(mockedAxios.get).toBeCalled();
    expect(getData).toStrictEqual('path');
  });

  test('should return response data', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const dataResolve = { data: 'data' };
    mockedAxios.create = jest.fn(() => axios);
    mockedAxios.get = jest.fn().mockResolvedValue(Promise.resolve(dataResolve));

    await throttledGetDataFromApi('path');
    jest.runAllTimers();

    const getData = mockedAxios.get.mock.results[0]?.value;
    expect(mockedAxios.get).toBeCalled();
    expect(getData).resolves.toStrictEqual(dataResolve);
  });
});
