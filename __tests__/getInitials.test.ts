import { getInitials } from '../src/utils/getInitials';

describe('getInitials', () => {
  it('uses first and last letters for two-word names', () => {
    expect(getInitials('Aisha Khan')).toBe('AK');
  });

  it('uses the first letter for a single word', () => {
    expect(getInitials('Aisha')).toBe('A');
  });

  it('falls back to L when the name is missing', () => {
    expect(getInitials('')).toBe('L');
    expect(getInitials(null)).toBe('L');
    expect(getInitials(undefined)).toBe('L');
  });

  it('uses first and last words when there are more than two', () => {
    expect(getInitials('Aisha Noor Khan')).toBe('AK');
  });
});
