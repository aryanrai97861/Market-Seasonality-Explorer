import { BinanceAPI } from './binance-api';

describe('BinanceAPI.calculateVolatilityLevel', () => {
  const api = new BinanceAPI();
  it('returns low for <2%', () => {
    expect(api.calculateVolatilityLevel(1.5)).toBe('low');
  });
  it('returns medium for 2-5%', () => {
    expect(api.calculateVolatilityLevel(3)).toBe('medium');
  });
  it('returns high for >5%', () => {
    expect(api.calculateVolatilityLevel(7)).toBe('high');
  });
  it('handles edge case at boundary', () => {
    expect(api.calculateVolatilityLevel(2)).toBe('medium');
    expect(api.calculateVolatilityLevel(5)).toBe('high');
  });
});
