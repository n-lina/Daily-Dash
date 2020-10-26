const express = require("express");
const admin = require('firebase-admin');
const router = express.Router();
const cossim = require('./cossim.js');

const GoalModel = require('../models/goals');

const devToken = "test";

const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }
  next();
};

const checkIfAuthenticated = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;

      if (authToken === devToken) {
        return next();
      }

      const userInfo = await admin
        .auth()
        .verifyIdToken(authToken);
      req.authId = userInfo.uid;

      return next();
    } catch (e) {
      console.log(e);

      return res
        .status(401)
        .send({ error: 'You are not authorized to make this request' });
    }
  });
};

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

    var responseObj = {
      longTermGoals: []
    };

    result.forEach(function (goal) {
      var goalResponse = {
        id: goal._id,
        title: goal.title,
        description: goal.description,
        shortTermGoals: []
      };

      goal.shortTermGoals.forEach(function (shortTermGoal) {
        var shortTermGoal = {
          id: shortTermGoal.id,
          title: shortTermGoal.title,
          mon: shortTermGoal.mon,
          tue: shortTermGoal.tue,
          wed: shortTermGoal.wed,
          thu: shortTermGoal.thu,
          fri: shortTermGoal.fri,
          sat: shortTermGoal.sat,
          sun: shortTermGoal.sun,
        };

        goalResponse.shortTermGoals.push(shortTermGoal);
      });

      responseObj.longTermGoals.push(goalResponse);
    });

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

    console.log(result);

    var responseObj = {
      shortTermGoals: []
    };

    result.forEach(function (goal) {
      goal.shortTermGoals.forEach(function (shortTermGoal) {
        shortTermGoal[dayOfWeek].forEach(function (time) {
          shortTermGoalObj = {
            stgId: shortTermGoal._id,
            title: shortTermGoal.title,
            time: time
          };

          responseObj.shortTermGoals.push(shortTermGoalObj);
        });
      });
    });

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
      docs.shortTermGoals.forEach(function (item) {
        STG_title_array.push(item.title);
      });
    });

  var arr_of_STG_cossim_scores = [STG_title_array.length];
  for (var i = 0; i < STG_title_array.length; i++) {      // get all cossim scores for request title vs STG array
    arr_of_STG_cossim_scores[i] = cossim.getCosSim(title, STG_title_array[i]);
  }
  let index_highest_cossim_STG = arr_of_STG_cossim_scores.indexOf(Math.max(...arr_of_STG_cossim_scores));
  response = STG_title_array[index_highest_cossim_STG];   // get most similar LTG title, else random-ish one
  res.send({ "answer": response });

};


router.get("/", checkIfAuthenticated, getGoals);
router.get("/shortterm", checkIfAuthenticated, getShortTermGoals);
router.post("/", checkIfAuthenticated, postGoal);
router.get("/suggestedstg", checkIfAuthenticated, getSuggestedShortTermGoal);

module.exports = router;