const GoalModel = require('../models/goals');

/*
 * Accepts a string to confirm whether there are characters other than punctuation and white space
 * @param     stringParam is the string to be analyzed
 * @return    returnVal is the boolean returned true if string contains characters other than 
 *            punctuation and white space, otherwise returned as false
 * @modifies  nothing
 */
function checkHasWords(stringParam) {
  let str = stringParam;  // unsure if pass by refernce in JS, so jsut in case...
  let returnVal = false;
  if (!str || 0 === str.length) {  // check if string is empty, null or undefined
    returnVal = false;  // if string is null, returns false
  }
  else {  // check if empty
    str
      .replace(/[.,?!;()"'-]/g, " ")  // replace punctuation
      .replace(/\s+/g, " ")           // make uniform white space usage
      .toLowerCase()                  // make uniform case for comparison
      .replace(" ", "");
    returnVal = !(str == ""); // if string not empty, returnVal is true
  }
  return returnVal; // if string not null or empty, returns true
}

/*
 * Accepts an array to confirm whether at least one array element is a non-empty string
 * @param   arrayParam is the array to be analyzed
 * @return  boolTrueIfOneEmpty is the boolean returned true if array contains at least one 
 *          element that is non-empty string
 * @modifies nothing
 */
function checkMinimumOneNonemptySTGTitle(arrayParam) {
  let stgArray = arrayParam;  // create local copy to not modify original array
  let boolTrueIfOneEmpty = false;
  for (var i = 0; i < stgArray.length; i++) {
    if (checkHasWords(stgArray[i].title)) {
      boolTrueIfOneEmpty = true;
    }
  }
  return boolTrueIfOneEmpty;
}

/*
* Fills parameter array with all valid LTG titles
* i.e. those with a valid title and at least 1 STG with valid title
* @param    arrayParam is the array to be filled
* @return   nothing
* @modifies array sent
*/
async function fillArrayWithValidLTGtitles(arrayParam) {
  await GoalModel.find({}, function (err, docs) {
    if (docs !== null) {  // ensure there is >0 LTG
      docs.forEach(function (item) {  // need && since only check 3rd condition if 2nd is true, else may get index out of range error
        if (checkHasWords(item.title) == true && item.shortTermGoals !== null &&
          checkMinimumOneNonemptySTGTitle(item.shortTermGoals)) {
          arrayParam.push(item.title); // ensure only add LTGs with a valid title and at least 1 STG with valid title
        }
      });
    }
  });
}

/*
* Fills parameter array with all valid STG titles of most similar LTG
* i.e. those with a valid title and at least 1 STG with valid title
* @param    arrayParamSTG is the array to be filled
* @param    arrayParamLTG is used to find LTG goal by title
* @param    indexHighCossimLTG is used to find LTG goal by title
* @return   nothing
* @modifies array sent as parameter arrayParamSTG
*/
async function fillArrayWithValidSTGtitles(arrayParamSTG, arrayParamLTG, indexHighCossimLTG) {
  await GoalModel.findOne({ title: arrayParamLTG[indexHighCossimLTG] },
    function (err, docs) {
      if (docs !== null) {  // ensure there is >0 LTG
        docs.shortTermGoals.forEach(function (item) {
          if (checkHasWords(item.title)) {
            arrayParamSTG.push(item.title);
          }
        });
      }
    });
}

module.exports = { fillArrayWithValidLTGtitles, fillArrayWithValidSTGtitles }