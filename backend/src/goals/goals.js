const express = require("express");
const router = express.Router();

const logger = require("../logger/logging");
const cossim = require("./cossim.js");
const auth = require("../firebase/auth");
const goalsHelper = require("./goalsHelper");
const goalsSugHelper = require("./goalsSugHelper.js");
const GoalModel = require("../models/goals");
const UserModel = require("../models/users");
var   cacheLTGsArray = [];
const maxLTGsInArray = 50;
const intervalRepopulatingTempLTGArray = 3000; // milliseconds

async function repopulateCacheLTGArray() {
  let countLTGs = await GoalModel.countDocuments({});
  let numLTGsToSample = countLTGs<=maxLTGsInArray ? countLTGs : maxLTGsInArray;
  cacheLTGsArray = await GoalModel.aggregate([ { $sample: { size: numLTGsToSample }}]);
}

// call repopulateCacheLTGArray once upon database startup to ensure it is populated before it is used elsewhere
var done = false;
if (!done) {
    done = true;
    repopulateCacheLTGArray();
}

setInterval(repopulateCacheLTGArray, intervalRepopulatingTempLTGArray);

const getGoals = async (req, res) => {
  const id = req.query.id;

  if (id == null) {
    logger.info("Missing parameters in ${JSON.stringify(req.query)}.");

    res.status(400);
    res.end();
    return;
  }

  try {
    var result = await GoalModel.find({ userId: id });
    var responseObj = goalsHelper.getGoalsResponseFromDBResult(result);
    logger.info(responseObj);

    res.send(responseObj);
  } catch (error) {
    res.status(500);
    logger.error(error);
    res.end();

    return;
  }
};

const getShortTermGoals = async (req, res) => {
  const id = req.query.id;
  const dayOfWeek = req.query.dayOfWeek;

  if (id == null || dayOfWeek == null) {
    logger.info("Missing parameters in ${req.params}");
    res.status(400);
    res.end();
    return;
  }

  try {
    var result = await GoalModel.find({ userId: id });
    var responseObj = goalsHelper.getShortTermGoalsResponseFromDbResult(result, dayOfWeek);
    logger.info(responseObj);

    res.send(responseObj);
  } catch (error) {
    res.status(500);
    logger.error(error);
    res.end();
    return;
  }
};

const postGoal = async (req, res) => {
  // read in variables from req object
  const userId = req.body.userId;
  const title = req.body.title;
  const description = req.body.description;
  const shortTermGoals = req.body.shortTermGoals;
  // directly access shortTermGoals fields like shortTermGoals[0].title

  // checks if all JSON entries in model present, except does not check elements of shortTermGoals
  if (userId == null || title == null || description == null || shortTermGoals == null) {
    logger.info(`Missing parameters in ${req.params}`);
    res.status(400);
    res.end();
    return;
  }

  const goalObj = new GoalModel({
    userId: userId,
    title: title,
    description: description,
    shortTermGoals: shortTermGoals
  });

  await goalObj.save()
    .then((doc) => {
      logger.info(doc);
    })
    .catch((err) => {
      logger.info(err);
    });

  var response = { id: userId };

  res.send(response);
};

const updateGoal = async (req, res) => {
  const ltgId = req.params.ltgId;
  const userId = req.body.userId;
  const title = req.body.title;
  const description = req.body.description;
  const shortTermGoals = req.body.shortTermGoals;

  if (ltgId == null || userId == null || title == null || description == null || shortTermGoals == null) {
    logger.info(`Missing parameters in ${req.body}`);
    res.status(400);
    res.end();
    return;
  }
  
  const query = {"_id": ltgId, "userId": userId};

  try {
    const currentGoal = await GoalModel.findOne(query);

    goalsHelper.updateShortTermGoalCounter(shortTermGoals, currentGoal.shortTermGoals);

    const goalObj = {
      userId: userId,
      title: title,
      description: description,
      shortTermGoals: shortTermGoals
    };

    await GoalModel.findOneAndUpdate(query, goalObj, {upsert: true}).then((doc) => {
      logger.info(doc);
    })
    .catch((err) => {
      logger.error(err);
    });

    res.send();
  } catch (error) {
    res.status(500);
    console.log(error);
    res.end();
    return;
  }
};

const getSuggestedShortTermGoal = async (req, res) => {
  const title = req.query.title;

  // ensure title param is string or String object, and checkHasWords() checks that not null, empty, or undefined
  if (!(typeof title == "string" || title instanceof String) || !goalsSugHelper.checkHasWords(title)) {
    logger.info(`Parameter in query url is either missing or not string with at least 1 character.`);
    res.status(400);
    res.end();
    return;
  }

  const noSugSTGString = "No suggested short term goal."; // value returned if no suggested STG for valid input

  try{
  var LTG_title_array = [];
  goalsSugHelper.fillArrayWithValidLTGtitles(LTG_title_array, cacheLTGsArray); // titles of LTGs with valid title and 1=< valid STF title

  if (LTG_title_array.length === 0) {    // do the following if no valid LTGs (and, by extension, STGs)
    logger.info("No long term goal with a valid short term goal in database.");
    res.send({ "answer": noSugSTGString });
    return;
  } // if code after this if statement runs, LTG_title_array has at least 1 LTG that has both, a valid title, and at least 1 STG with valid title

  var arr_of_LTG_cossim_scores = [LTG_title_array.length];
  for (let i = 0; i < LTG_title_array.length; i++) {  // fill array with all cossim scores for request title vs LTG titles
    arr_of_LTG_cossim_scores[i] = cossim.getCosSim(title, LTG_title_array[i]);
  }
  
  let index_highest_cossim_LTG = arr_of_LTG_cossim_scores.indexOf(Math.max(...arr_of_LTG_cossim_scores));
  let highest_cossim_LTG_title = LTG_title_array[index_highest_cossim_LTG];   // get most similar LTG title, else random-ish one

  var STG_title_array = [];
  await goalsSugHelper.fillArrayWithValidSTGtitles(STG_title_array, highest_cossim_LTG_title); // fill array with most similar LTG's STG titles

  if (STG_title_array.length === 0) {  // redundant check: do the following if no valid STGs (and, by extension, STGs)
    logger.info("No valid short term goals in database.");
    res.send({ "answer": noSugSTGString });
    return;
  }

  var arr_of_STG_cossim_scores = [STG_title_array.length];
  for (let i = 0; i < STG_title_array.length; i++) {
    arr_of_STG_cossim_scores[i] = cossim.getCosSim(title, STG_title_array[i]);
  }

  let index_highest_cossim_STG = arr_of_STG_cossim_scores.indexOf(Math.max(...arr_of_STG_cossim_scores));
  var mostSimilarSTG = STG_title_array[index_highest_cossim_STG];   // get most similar LTG title, else random-ish one

  var response = mostSimilarSTG == null ? noSugSTGString : mostSimilarSTG;
  res.send({ "answer": response });

  } catch (error) {
    res.status(500);
    logger.error(error);
    res.end();
    return;
  }
};

const completeShortTermGoal = async (req, res) => {
  const userId = req.body.userId;
  const shortTermGoalId = req.body.shortTermGoalId;
  const complete = req.body.complete;

  if (userId == null || shortTermGoalId == null || complete == null) {
    logger.info("Missing parameters in ${req.params}");
    res.status(400);
    res.end();
    return;
  }

  const countIncrement = complete ? 1 : -1;
  var success = false;

  try {
    const goalUpdateFilter = {"userId": userId, "shortTermGoals._id": shortTermGoalId};
    const goalUpdateQuery = {$inc: {"shortTermGoals.$.timesCompleted" : countIncrement}};

    const goalUpdateResult = await GoalModel.findOneAndUpdate(goalUpdateFilter, goalUpdateQuery);

    if (goalUpdateResult != null) {
      const userUpdateFilter = {"userId": userId};
      const userUpdateQuery = {$inc: {"goalsCompleted" : countIncrement}};

      const userUpdateResult = await UserModel.findOneAndUpdate(userUpdateFilter, userUpdateQuery);

      success = userUpdateResult != null ? true : false
    }

    if (complete && success) {
      logger.info("Successfully incremented short term goal");
    } else if (!complete && success) {
      logger.info("Successfully decremented short term goal");
    } else {
      logger.info("Failed to update short term goal");
    }

    const responseObj = {"success": success};

    res.send(responseObj);
  } catch (error) {
    res.status(500);
    logger.error(error);
    res.end();
    return;
  }
};

const deleteLTG = async (req, res) => {
  const ltgId = req.params;

  if (ltgId == null) {
    logger.info("Missing parameters in ${JSON.stringify(req.query)}.");
    res.status(400);
    res.end();
    return;
  }

  try {
    GoalModel.findOneAndDelete(ltgId, function (err, res) { 
      if (err){ 
        logger.error(err); 
      } 
      else{ 
        logger.info(res);
      } 
    }); 
    res.send();
  } catch (error) {
    res.status(500);
    logger.error(error);
    res.end();
    return;
  }
};

router.get("/", auth.checkIfAuthenticated, getGoals);
router.post("/", auth.checkIfAuthenticated, postGoal);
router.put("/:ltgId", auth.checkIfAuthenticated, updateGoal);
router.get("/shortterm", auth.checkIfAuthenticated, getShortTermGoals);
router.get("/suggestedstg", auth.checkIfAuthenticated, getSuggestedShortTermGoal);
router.put("/shortterm/counter", auth.checkIfAuthenticated, completeShortTermGoal);
router.delete("/:_id", auth.checkIfAuthenticated, deleteLTG);

module.exports = router;
