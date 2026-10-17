import { isValidThaiNationalId } from '../../src/domain/thaiNationalId';

describe('isValidThaiNationalId', () => {
  it('accepts an id whose last digit matches the checksum', () => {
    const id = '1509900000017';

    const valid = isValidThaiNationalId(id);

    expect(valid).toBe(true);
  });

  it.each(['1100000000016', '1100000000024'])('accepts another id with a correct checksum "%s"', (id) => {
    const valid = isValidThaiNationalId(id);

    expect(valid).toBe(true);
  });

  it.each(['1509900000018', '1100000000017'])('rejects id "%s" whose checksum digit is wrong', (id) => {
    const valid = isValidThaiNationalId(id);

    expect(valid).toBe(false);
  });

  it.each([
    ['empty', ''],
    ['12 digits', '150990000001'],
    ['14 digits', '15099000000170'],
    ['a letter among 13 characters', '150990000001x'],
    ['13 letters', 'abcdefghijklm'],
  ])('rejects a malformed id: %s', (_case, id) => {
    const valid = isValidThaiNationalId(id);

    expect(valid).toBe(false);
  });
});
