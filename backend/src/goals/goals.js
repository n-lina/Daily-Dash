const express = require("express");
const router = express.Router();

const logger = require("../logger/logging");
const cossim = require("./cossim.js");
const auth = require("../firebase/auth");
const goalsHelper = require("./goalsHelper");
const goalsSugHelper = require("./goalsSugHelper.js");
const GoalModel = require("../models/goals");
const UserModel = require("../models/users");

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

const getSuggestedShortTermGoal = async (req, res) => {
  const title = req.query.title;

  // ensure title param not null, empty, or undefined, and is string or String object
  if ((!title || 0 === title.length) || !(typeof title == "string" || title instanceof String)) {
    logger.info(`Missing parameters in query url, or param is empty or not string`);
    res.status(400);
    res.end();
    return;
  }

  const noSugSTGString = "No suggested short term goal."; // value returned if no suggested STG for valid input

  var LTG_title_array = [];
  try {   // fill array with all valid LTG titles (i.e. has both, a valid title, and at least 1 STG with valid title)
    await goalsSugHelper.fillArrayWithValidLTGtitles(LTG_title_array);
  }
  catch (error) {
    res.status(500);
    logger.info(error);
    res.end();
    return;
  }

  if (LTG_title_array.length === 0) {    // do the following if no valid LTGs (and, by extension, STGs)
    logger.info("No long term goal with a valid short term goal in database.");
    res.send({ "answer": noSugSTGString });
    return;
  } // if code after this if statement runs, LTG_title_array has at least 1 LTG that has both, a valid title, and at least 1 STG with valid title

  var arr_of_LTG_cossim_scores = [LTG_title_array.length];
  try { // fill array with all cossim scores for request title vs LTG titles in DB
    for (let i = 0; i < LTG_title_array.length; i++) {
      arr_of_LTG_cossim_scores[i] = cossim.getCosSim(title, LTG_title_array[i]);
    }
  }
  catch (error) {
    res.status(500);
    logger.error(error);
    res.end();
    return;
  }

  let index_highest_cossim_LTG = arr_of_LTG_cossim_scores.indexOf(Math.max(...arr_of_LTG_cossim_scores));
  let highest_cossim_LTG_title = LTG_title_array[index_highest_cossim_LTG];   // get most similar LTG title, else random-ish one

  var STG_title_array = [];
  try {  // fill array with all of most similar LTG's STG titles
    await goalsSugHelper.fillArrayWithValidSTGtitles(STG_title_array, highest_cossim_LTG_title);
  }
  catch (error) {
    res.status(500);
    logger.info(error);
    res.end();
    return;
  }

  if (STG_title_array.length === 0) {  // redundant check: do the following if no valid STGs (and, by extension, STGs)
    logger.info("No valid short term goals in database.");
    res.send({ "answer": noSugSTGString });
    return;
  }

  var arr_of_STG_cossim_scores = [STG_title_array.length];
  try { // fill array with all cossim scores for request title vs STG array
    for (let i = 0; i < STG_title_array.length; i++) {
      arr_of_STG_cossim_scores[i] = cossim.getCosSim(title, STG_title_array[i]);
    }
  }
  catch (error) {
    res.status(500);
    logger.error(error);
    res.end();
    return;
  }

  let index_highest_cossim_STG = arr_of_STG_cossim_scores.indexOf(Math.max(...arr_of_STG_cossim_scores));
  var mostSimilarLTG = STG_title_array[index_highest_cossim_STG];   // get most similar LTG title, else random-ish one

  var response = mostSimilarLTG == null ? noSugSTGString : mostSimilarLTG;

  res.send({ "answer": response });
};

const completeShortTermGoal = async (req, res) => {
  const userId = req.body.userId;
  const shortTermGoalId = req.body.shortTermGoalId;

  if (userId == null || shortTermGoalId == null) {
    logger.info("Missing parameters in ${req.params}");
    res.status(400);
    res.end();
    return;
  }

  try {
    const goalUpdateQuery = {"userId": userId, "shortTermGoals._id": shortTermGoalId};

    const goalUpdateResult = await GoalModel.findOneAndUpdate(goalUpdateQuery,
      {$inc: {"shortTermGoals.$.timesCompleted" : 1}});

    var success = false;

    if (goalUpdateResult != null) {
      const userUpdateQuery = {"userId": userId};

      const userUpdateResult = await UserModel.findOneAndUpdate(userUpdateQuery,
        {$inc: {"goalsCompleted" : 1}});

      if (userUpdateResult != null) {
        success = true;
        logger.info("Successfully incremented short term goal");
      }
    }

    var responseObj = {"success": success};

    res.send(responseObj);
  } catch (error) {
    res.status(500);
    logger.error(error);
    res.end();
    return;
  }
};

router.get("/", auth.checkIfAuthenticated, getGoals);
router.get("/shortterm", auth.checkIfAuthenticated, getShortTermGoals);
router.post("/", auth.checkIfAuthenticated, postGoal);
router.get("/suggestedstg", auth.checkIfAuthenticated, getSuggestedShortTermGoal);
router.put("/shortterm/counter", auth.checkIfAuthenticated, completeShortTermGoal);

module.exports = router;
