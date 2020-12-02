const cossimImport = require('../cossim.js');

describe("Test functions that are not getCosSim; does not require mocks", () => {
  const str1 = 'Julie loves me more than Linda loves me';
  const str2 = "Jane likes me more than Julie loves me";
  let expectedmakeWordTallyResultstr1 =  { julie: 1, loves: 2, me: 2, more: 1, than: 1, linda: 1 };
  let expectedmakeWordTallyResultstr2 =  { jane: 1, likes: 1, me: 2, more: 1, than: 1, julie: 1, loves: 1 };
  let expectedmakeAllValuesZeroResultstr1 =  { julie: 0, loves: 0, me: 0, more: 0, than: 0, linda: 0 };
  let expectedmakeAllValuesZeroResultstr2 =  { jane: 0, likes: 0, me: 0, more: 0, than: 0, julie: 0, loves: 0 };
  let calccossimParam1 = [0, 1, 0, 1, 2, 2, 1, 1];
  let calccossimParam2 = [1, 1, 1, 0, 1, 2, 1, 1];
  let expectedcalccossimResult = 0.8215838362577491;
  
  test("test function makeWordTally, should expected tally", () => {
    expect(cossimImport.makeWordTally(str1)).toEqual(expectedmakeWordTallyResultstr1);
    expect(cossimImport.makeWordTally(str2)).toEqual(expectedmakeWordTallyResultstr2);
  })
   
  test("test function makeAllValuesZero, should expected vector with all zeros", () => {
    expect(cossimImport.makeAllValuesZero(expectedmakeWordTallyResultstr1)).toEqual(expectedmakeAllValuesZeroResultstr1);
    expect(cossimImport.makeAllValuesZero(expectedmakeWordTallyResultstr2)).toEqual(expectedmakeAllValuesZeroResultstr2);
  })

  test("test function calccossim, should expected 0.821...", () => {
    expect(cossimImport.calccossim(calccossimParam1,calccossimParam2)).toEqual(expectedcalccossimResult);
  })

})


describe("Test getCosSim; requires mocks", () => {

  test("test function getCosSim; should get expected score", () => {
    const str1 = 'Julie loves me more than Linda loves me';
    const str2 = "Jane likes me more than Julie loves me";
    let expectedmakeWordTallyResultstr1 =  { julie: 1, loves: 2, me: 2, more: 1, than: 1, linda: 1 };
    let expectedmakeWordTallyResultstr2 =  { jane: 1, likes: 1, me: 2, more: 1, than: 1, julie: 1, loves: 1 };
    let expectedmakeAllValuesZeroResultstr1 =  { julie: 0, loves: 0, me: 0, more: 0, than: 0, linda: 0 };
    let expectedmakeAllValuesZeroResultstr2 =  { jane: 0, likes: 0, me: 0, more: 0, than: 0, julie: 0, loves: 0 };
    let expectedcalccossimResult = 0.8215838362577491;
    let expectedGetCosSimResult = expectedcalccossimResult;

    cossimImport.makeWordTally = jest.fn().mockImplementation(str => {
      switch (str) {
        case str1:
          return expectedmakeWordTallyResultstr1;
        case str2:
          return expectedmakeWordTallyResultstr2;
      }
    });

    cossimImport.makeWordTally = jest.fn().mockImplementation(makeWordTallyResult => {
      switch (makeWordTallyResult) {
        case expectedmakeWordTallyResultstr1:
          return expectedmakeAllValuesZeroResultstr1;
        case expectedmakeWordTallyResultstr2:
          return expectedmakeAllValuesZeroResultstr2;
      }
    });
    
    cossimImport.calccossim =  jest.fn().mockImplementation((param1,param2) => {
      if (param1 === expectedmakeAllValuesZeroResultstr1 && param2 === expectedmakeAllValuesZeroResultstr2) {
       return expectedcalccossimResult;
      }
    })
    
    expect(cossimImport.getCosSim(str1, str2)).toBe(expectedGetCosSimResult);
  })

})
