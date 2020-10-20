const express = require("express");
const router = express.Router();

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
    var result = await GoalModel.find({userId: id});

    console.log(result);

    if (result == null) {
      res.status(400);
      res.send(null);
      return;
    }

    var responseObj = {
      longTermGoals: []
    };

    result.forEach(function(goal) {
      var goalResponse = {
        title: goal.title,
        description: goal.description,
        shortTermGoals: []
      };

      goal.shortTermGoals.forEach(function(shortTermGoal) {
        var shortTermGoal = {
          title: shortTermGoal.title,
          description: shortTermGoal.description,
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
    var result = await GoalModel.find({userId: id});

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

    result.forEach(function(goal) {
      goal.shortTermGoals.forEach(function(shortTermGoal) {
        shortTermGoal[dayOfWeek].forEach(function (time) {
            shortTermGoalObj = {
              title: shortTermGoal.title,
              description: shortTermGoal.description,
              time: time.minute,
              id: time._id
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

router.get("/", getGoals);
router.get("/shortterm", getShortTermGoals);

module.exports = router;
