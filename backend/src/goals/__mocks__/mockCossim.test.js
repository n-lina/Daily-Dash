/*
 * This test attains full coverage of cossim.js, passes all tests, a
 * and mocks an external dependency (i.e. an imported function),
 * function checkHasWords from module goalsSugHelper.js
 */

const cossimFunctions = require('../cossim.js');
const goalsSugHelperImport = require('../goalsSugHelper');

describe('Testing getCosSim', () => {

  test('should pass: test correct inputs', () => {
    goalsSugHelperImport.checkHasWords = jest.fn((str1, str2) => true);
    expect(cossimFunctions.getCosSim("Julie loves me more than Linda loves me", "Jane likes me more than Julie loves me")).toBe(0.8215838362577491);
  });

  test('should throw error: 1st parameter has no characters or numbers', () => {
    goalsSugHelperImport.checkHasWords = jest.fn((str1, str2) => false);
    expect(() => {
      cossimFunctions.getCosSim("^  *)(@", "Neat-o");
    }).toThrow("Parameters not string");
  });

  test('should throw error: 2nd parameter has no characters or numbers', () => {
    goalsSugHelperImport.checkHasWords = jest.fn((str1, str2) => false);
    expect(() => {
      cossimFunctions.getCosSim("Hi everyone", "@#&(*! !@@@#$");
    }).toThrow("Parameters not string");
  });

});
