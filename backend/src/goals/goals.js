const express = require("express");
const router = express.Router();
const logger = require("../logger/logging");
const cossim = require("./cossim.js");
const auth = require("../firebase/auth");
const goalsHelper = require("./goalsHelper");
const goalsSugHelper = require("./goalsSugHelper.js");
const GoalModel = require("../models/goals");

var   cacheLTGsArray = [];
global.GlobalcacheLTGsArray = cacheLTGsArray;
// const maxLTGsInArray = 50;
// const intervalRepopulatingTempLTGArray = 3000; // milliseconds

// call repopulateCacheLTGArray once upon database startup to ensure it is populated before it is used elsewhere
// var done = false;
// if (!done) {
//     done = true;
//     goalsHelper.repopulateCacheLTGArray(maxLTGsInArray, cacheLTGsArray);
// }

// setInterval(function() { 
//   goalsHelper.repopulateCacheLTGArray(maxLTGsInArray, cacheLTGsArray) 
// }, intervalRepopulatingTempLTGArray);

/*
  Functions for database access
*/
async function findGoals(id) {
  var result = await GoalModel.find({ userId: id });
  var responseObj = goalsHelper.getGoalsResponseFromDBResult(result);
  logger.info(responseObj);

  return responseObj;
}

async function findShortTermGoalsGoals(id, dayOfWeek) {
  var result = await GoalModel.find({ userId: id });
  var responseObj = goalsHelper.getShortTermGoalsResponseFromDbResult(result, dayOfWeek);
  logger.info(responseObj);

  return responseObj;
}

async function addGoal(userId, title, description, shortTermGoals) {
  const goalObj = new GoalModel({
    userId: userId, title: title, description: description, shortTermGoals: shortTermGoals });

  await goalObj.save()
    .then((doc) => {
      logger.info(doc);
    });


  var responseObj = { id: userId };

  return responseObj;
}

/*
  Express endpoints
*/
router.get("/", auth.checkIfAuthenticated, async (req, res) => {
  const id = req.query.id;

  if (id == null) {
    logger.info("Missing parameters in ${JSON.stringify(req.query)}.");

    res.status(400);
    res.end();
    return;
  }

  var responseObj = await findGoals(id);
  res.send(responseObj);
});

router.get("/shortterm", auth.checkIfAuthenticated, async (req, res) => {
  const id = req.query.id;
  const dayOfWeek = req.query.dayOfWeek;

  if (id == null || dayOfWeek == null) {
    logger.info("Missing parameters in ${req.params}");
    res.status(400);
    res.end();
    return;
  }

  try {
    var responseObj = await findShortTermGoalsGoals(id, dayOfWeek);
    res.send(responseObj);
  } catch (error) {
    res.status(500);
    logger.error(error);
    res.end();
    return;
  }
});

router.post("/", auth.checkIfAuthenticated, async (req, res) => {
  const userId = req.body.userId;
  const title = req.body.title;
  const description = req.body.description;
  const shortTermGoals = req.body.shortTermGoals;

  if (userId == null || title == null || description == null || shortTermGoals == null) {
    logger.info(`Missing parameters in ${req.params}`);
    res.status(400);
    res.end();
    return;
  }

  const responseObj = await addGoal(userId, title, description, shortTermGoals);

  res.send(responseObj);
});

const getSuggestedShortTermGoal = async (req, res) => {
  const title = req.query.title;

  if (!(typeof title == "string" || title instanceof String) || !goalsSugHelper.checkHasWords(title)) {
    logger.info(`Parameter in query url is either missing or not string with at least 1 character.`);
    res.status(400);
    res.end();
    return;
  }

  const noSugSTGString = "No suggested short term goal.";

  try{
  var LTG_title_array = [];
  goalsSugHelper.fillArrayWithValidLTGtitles(LTG_title_array);

  if (LTG_title_array.length === 0) {
    logger.info("No long term goal with a valid short term goal in database.");
    res.send({ "answer": noSugSTGString });
    return;
  }

  var arr_of_LTG_cossim_scores = [LTG_title_array.length];
  for (let i = 0; i < LTG_title_array.length; i++) {
    arr_of_LTG_cossim_scores[i] = cossim.getCosSim(title, LTG_title_array[i]);
  }
  
  let index_highest_cossim_LTG = arr_of_LTG_cossim_scores.indexOf(Math.max(...arr_of_LTG_cossim_scores));
  let highest_cossim_LTG_title = LTG_title_array[index_highest_cossim_LTG];

  var STG_title_array = [];
  await goalsSugHelper.fillArrayWithValidSTGtitles(STG_title_array, highest_cossim_LTG_title);

  if (STG_title_array.length === 0) {  // redundant check in case no valid STGs (and, by extension, STGs)
    logger.info("No valid short term goals in database.");
    res.send({ "answer": noSugSTGString });
    return;
  }

  var arr_of_STG_cossim_scores = [STG_title_array.length];
  for (let i = 0; i < STG_title_array.length; i++) {
    arr_of_STG_cossim_scores[i] = cossim.getCosSim(title, STG_title_array[i]);
  }

  let index_highest_cossim_STG = arr_of_STG_cossim_scores.indexOf(Math.max(...arr_of_STG_cossim_scores));
  var mostSimilarSTG = STG_title_array[index_highest_cossim_STG];

  var response = mostSimilarSTG == null ? noSugSTGString : mostSimilarSTG;
  res.send({ "answer": response });

  } catch (error) {
    res.status(500);
    logger.error(error);
    res.end();
    return;
  }
};

router.put("/:ltgId", auth.checkIfAuthenticated, goalsHelper.updateGoal);
router.get("/suggestedstg", auth.checkIfAuthenticated, getSuggestedShortTermGoal);
router.put("/shortterm/counter", auth.checkIfAuthenticated, goalsHelper.completeShortTermGoal);
router.delete("/:_id", auth.checkIfAuthenticated, goalsHelper.deleteLTG);

module.exports = router;
