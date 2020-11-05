const mockCossim = require("./mockCossim.js");

test("Should be 0.822", () => {
  const str1 = 'Julie loves me more than Linda loves me';
  const str2 = "Jane likes me more than Julie loves me";
  const str3 = 'l';
  expect(mockCossim.getCosSimMock(str1, str2)).toBe(0.822);
});
