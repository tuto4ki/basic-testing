//import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    jest.useFakeTimers();

    jest.mock('axios');

    //axios.create.mockResolvedValue
    throttledGetDataFromApi('getPath');

    jest.unmock('axios');

    jest.useRealTimers();
  });

  test('should perform request to correct provided url', async () => {
    // Write your test here
  });

  test('should return response data', async () => {
    // Write your test here
  });
});
