const mockCossim = require('./mockCossim.js');

test('Should be 0.822', () => {
  str1 = "Julie loves me more than Linda loves me";
  str2 = "Jane likes me more than Julie loves me";
  expect(mockCossim.getCosSimMock(str1, str2)).toBe(0.822);
});