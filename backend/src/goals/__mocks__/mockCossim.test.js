const mockCossim = require("./mockCossim.js");

test("Should be 0.822", () => {
  const str1 = 'Julie loves me more than Linda loves me';
  const str2 = "Jane likes me more than Julie loves me";
  expect(mockCossim.getCosSimMock(str1, str2)).toBe(0.822);
});

const functions = require('../cossim.js');

describe('Testing getCosSim', () => {
  it('Should run Apple', () => {
    functions.makeWordTally = jest.fn().mockImplementation((str) => {
      // expected and mocked values
      const expectedstr1 = "Julie loves me more than Linda loves me";
      const wordTally1 = { julie = 1, loves = 2, me = 2, more = 1, than = 1, linda = 1};
      const expectedstr2 = "Jane likes me more than Julie loves me";
      const wordTally2 = { jane = 1, likes = 2, me = 2, more = 1, than = 1, julie = 1, loves = 1};
      if ( str === expectedstr1 ) {
        return wordTally1;
      }
      else if (str === expectedstr2) { 
        return wordTally2;
      } 
      else {
        console.log('ERROR MAKEWORDTALLY');
      }
    });

    functions.makeAllValuesZero = jest.fn().mockImplementation((map) => {
      const expectedmap1 = { julie = 1, loves = 2, me = 2, more = 1, than = 1, linda = 1};
      const response1 = { julie = 0, loves = 0, me = 0, more = 0, than = 0, linda = 0};
      const expectedmap2 = { julie = 1, loves = 2, me = 2, more = 1, than = 1, linda = 1};
      const response2 = { jane = 0, likes = 0, me = 0, more = 0, than = 0, julie = 0, loves = 0};
      if ( map === response1 ) {
        return response1;
      }
      else if (map === response2) { 
        return response2;
      }
      else {
        console.log('ERROR MAKEALLVALS0');
      } 
    });

    functions.similarity = jest.fn().mockImplementation((vec1, vec2) => {
      
      return 0.822;
    });

    

    expect(functions.Apple()).toEqual(3);
  });
});