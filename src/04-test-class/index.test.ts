import lodash from 'lodash';
import { getBankAccount } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const balance = 1000;
    const blank = getBankAccount(balance);
    expect(blank.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = 100;
    const withdrawing = 1000;
    const blank = getBankAccount(balance);
    const errorMessage = `Insufficient funds: cannot withdraw more than ${balance}`;
    expect(() => blank.withdraw(withdrawing)).toThrow(errorMessage);
  });

  test('should throw error when transferring more than balance', () => {
    const balance = 100;
    const withdrawing = 1000;
    const blank = getBankAccount(balance);
    const blankTwo = getBankAccount(0);
    const errorMessage = `Insufficient funds: cannot withdraw more than ${balance}`;
    expect(() => blank.transfer(withdrawing, blankTwo)).toThrow(errorMessage);
  });

  test('should throw error when transferring to the same account', () => {
    const balance = 100;
    const withdrawing = 1000;
    const blank = getBankAccount(balance);
    const errorMessage = 'Transfer failed';
    expect(() => blank.transfer(withdrawing, blank)).toThrow(errorMessage);
  });

  test('should deposit money', () => {
    const balance = 100;
    const deposit = 50;
    const blank = getBankAccount(balance).deposit(deposit);
    expect(blank.getBalance()).toBe(balance + deposit);
  });

  test('should withdraw money', () => {
    const balance = 100;
    const withdraw = 50;
    const blank = getBankAccount(balance).withdraw(withdraw);
    expect(blank.getBalance()).toBe(balance - withdraw);
  });

  test('should transfer money', () => {
    const balance = 100;
    const transfer = 10;
    const blank = getBankAccount(balance);
    const blankTwo = getBankAccount(balance);
    blank.transfer(transfer, blankTwo);
    expect(blank.getBalance()).toBe(balance - transfer);
    expect(blankTwo.getBalance()).toBe(balance + transfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const numRandom = 1;
    jest.spyOn(lodash, 'random').mockReturnValue(numRandom);
    const balance = 100;
    const blank = getBankAccount(balance);
    await expect(blank.fetchBalance()).resolves.toEqual(numRandom);
    jest.spyOn(lodash, 'random').mockRestore();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const numRandom = 1;
    jest.spyOn(lodash, 'random').mockReturnValue(numRandom);
    const balance = 100;
    const blank = getBankAccount(balance);
    await blank.synchronizeBalance();
    expect(blank.getBalance()).toEqual(numRandom);
    jest.spyOn(lodash, 'random').mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(lodash, 'random').mockReturnValue(0);
    const balance = 100;
    const blank = getBankAccount(balance);
    const errorMessage = 'Synchronization failed';
    await expect(blank.synchronizeBalance()).rejects.toThrow(errorMessage);
    jest.spyOn(lodash, 'random').mockRestore();
  });
});
