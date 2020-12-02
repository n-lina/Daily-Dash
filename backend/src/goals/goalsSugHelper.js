const GoalModel = require("../models/goals");

/*
 * Accepts a string to confirm whether there are characters other than punctuation and white space
 * @param     stringParam is the string to be analyzed
 * @return    returnVal is the boolean returned true if string contains characters other than
 *            punctuation and white space, otherwise returned as false
 * @modifies  nothing
 */
function checkHasWords(stringParam) {
  let str = stringParam;
  let returnVal = false;
  if (!str || 0 === str.length) {
    returnVal = false;
  } else {
    str = str
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ")
      .toLowerCase();
    returnVal = !(str == "");
  }
  return returnVal;
}

/*
 * Accepts an array to confirm whether at least one array element is a non-empty string
 * @param   arrayParam is the array to be analyzed
 * @return  boolTrueIfOneEmpty is the boolean returned true if array contains at least one
 *          element that is non-empty string
 * @modifies nothing
 */
function checkMinimumOneNonemptySTGTitle(arrayParam) {
  let stgArray = arrayParam;
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
 * @modifies arrayParam
 */
function fillArrayWithValidLTGtitles(arrayParam) {
  if (global.GlobalcacheLTGsArray !== null) {
    global.GlobalcacheLTGsArray.forEach(function (item) {
      if (
        checkHasWords(item.title) === true &&
        item.shortTermGoals !== null &&
        checkMinimumOneNonemptySTGTitle(item.shortTermGoals)
      ) {
        arrayParam.push(item.title);
      }
    });
  }
}

/*
 * Fills parameter array with all valid STG titles of most similar LTG
 * i.e. those with a valid title and at least 1 STG with valid title
 * @param    arrayParamSTG is the array to be filled
 * @param    arrayParamLTG is used to find LTG goal by title
 * @return   nothing
 * @modifies arrayParamSTG
 */
async function fillArrayWithValidSTGtitles(
  arrayParamSTG,
  highestCossimLTGTitle
) {
  await GoalModel.findOne(
    { title: highestCossimLTGTitle },
    function (err, docs) {
      if (docs !== null) {
        docs.shortTermGoals.forEach(function (item) {
          if (checkHasWords(item.title)) {
            arrayParamSTG.push(item.title);
          }
        });
      }
    }
  );
}

module.exports = {
  fillArrayWithValidLTGtitles,
  fillArrayWithValidSTGtitles,
  checkHasWords
};
