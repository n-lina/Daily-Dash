const express = require("express");
const router = express.Router();

const cossim = require('./cossim.js');
const auth = require('../firebase/auth');
const goalsHelper = require('./goalsHelper')
const GoalModel = require('../models/goals');

const getGoals = async (req, res) => {
  const { id } = req.query;

  if (id == null) {
    console.log(`Missing parameters in ${req.body}`);
    res.status(400);
    res.end();
    return;
  }

  try {
    var result = await GoalModel.find({ userId: id });
    console.log(result);

    if (result == null) {
      res.status(400);
      res.send(null);

      return;
    }

    var responseObj = goalsHelper.getGoalsResponseFromDBResult(result);

    res.send(responseObj);
  } catch (error) {
    res.status(400);
    console.log(error);
    res.end();

    return;
  }
};

const getShortTermGoals = async (req, res) => {
  const { id } = req.query;
  const { dayOfWeek } = req.query;

  if (id == null || dayOfWeek == null) {
    console.log(`Missing parameters in ${req.params}`);
    res.status(400);
    res.end();
    return;
  }

  try {
    var result = await GoalModel.find({ userId: id });
    console.log(result);

    if (result == null) {
      res.status(400);
      res.send(null);
      return;
    }

    responseObj = goalsHelper.getShortTermGoalsResponseFromDbResult(result, dayOfWeek);

    res.send(responseObj);
  } catch (error) {
    res.status(400);
    console.log(error);
    res.end();
    return;
  }
};

const postGoal = async (req, res) => {
  // read in variables from req object
  const { userId } = req.body;
  const { title } = req.body;
  const { description } = req.body;
  const { shortTermGoals } = req.body;
  // directly access shortTermGoals fields like shortTermGoals[0].title

  // checks if all JSON entries in model present, except does not check elements of shortTermGoals
  if (userId == null || title == null || description == null || shortTermGoals == null) {
    console.log(`Missing parameters in ${req.params}`);
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
      console.log(doc);
    })
    .catch((err) => {
      console.error(err);
    });

  var response = { id: userId };

  res.send(response);

};

const getSuggestedShortTermGoal = async (req, res) => {
  const { title } = req.query;
  
  var LTG_title_array = [];   // create an array with all LTG titles
  await GoalModel.find({}, function (err, docs) {
    docs.forEach(function (item) {
      LTG_title_array.push(item.title);
    });
  });

  var arr_of_LTG_cossim_scores = [LTG_title_array.length];
  for (var i = 0; i < LTG_title_array.length; i++) {    // fill array with all cossim scores for request title vs LTG titles in DB
    arr_of_LTG_cossim_scores[i] = cossim.getCosSim(title, LTG_title_array[i]);
  }

  let index_highest_cossim_LTG = arr_of_LTG_cossim_scores.indexOf(Math.max(...arr_of_LTG_cossim_scores));
  highest_cossim_LTG_title = LTG_title_array[index_highest_cossim_LTG];   // get most similar LTG title, else random-ish one

  var STG_title_array = [];   // fill array with all of most similar LTG's STG titles
  await GoalModel.findOne({ title: LTG_title_array[index_highest_cossim_LTG] },  
    function (err, docs) {
      if (docs !== null) {
          docs.shortTermGoals.forEach(function (item) {
          STG_title_array.push(item.title);
        });
      }
    });

  var arr_of_STG_cossim_scores = [STG_title_array.length];
  for (var i = 0; i < STG_title_array.length; i++) {      // get all cossim scores for request title vs STG array
    arr_of_STG_cossim_scores[i] = cossim.getCosSim(title, STG_title_array[i]);
  }
  let index_highest_cossim_STG = arr_of_STG_cossim_scores.indexOf(Math.max(...arr_of_STG_cossim_scores));
  var mostSimilarLTG = STG_title_array[index_highest_cossim_STG];   // get most similar LTG title, else random-ish one

  var response = mostSimilarLTG == null ? "No suggested long term goal." : mostSimilarLTG;

  res.send({ "answer": response });
};

router.get("/", auth.checkIfAuthenticated, getGoals);
router.get("/shortterm", auth.checkIfAuthenticated, getShortTermGoals);
router.post("/", auth.checkIfAuthenticated, postGoal);
router.get("/suggestedstg", auth.checkIfAuthenticated, getSuggestedShortTermGoal);

module.exports = router;