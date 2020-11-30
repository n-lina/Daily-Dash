var mongoose = require('mongoose');
const GoalModel = require("../models/goals");
const UserModel = require("../models/users");
const logger = require("../logger/logging");

const getGoalsResponseFromDBResult = (result) => {
  const responseObj = {
    longTermGoals: []
  };

  if (result == null) {
    return responseObj;
  }

  result.forEach(function (goal) {
    var goalResponse = {
      id: goal._id,
      title: goal.title,
      description: goal.description,
      shortTermGoals: [],
    };

    goal.shortTermGoals.forEach(function (shortTermGoal) {
      var shortTermGoalObj = {
        id: shortTermGoal.id,
        title: shortTermGoal.title,
        timesCompleted: shortTermGoal.timesCompleted,
        mon: shortTermGoal.mon,
        tue: shortTermGoal.tue,
        wed: shortTermGoal.wed,
        thu: shortTermGoal.thu,
        fri: shortTermGoal.fri,
        sat: shortTermGoal.sat,
        sun: shortTermGoal.sun,
      };

      goalResponse.shortTermGoals.push(shortTermGoalObj);
    });

    responseObj.longTermGoals.push(goalResponse);
  });

  return responseObj;
};

const getShortTermGoalsResponseFromDbResult = (result, dayOfWeek) => {
  var _shortTermGoals = [];

  var responseObj = {
    shortTermGoals: _shortTermGoals
  };

  if (result == null) {
    return responseObj;
  }

  result.forEach(function (goal) {
    goal.shortTermGoals.forEach(function (shortTermGoal) {
      shortTermGoal[dayOfWeek].forEach(function (time) {
        var shortTermGoalObj = {
          stgId: shortTermGoal._id,
          title: shortTermGoal.title,
          time
        };

        _shortTermGoals.push(shortTermGoalObj);
      });
    });
  });

  _shortTermGoals.sort(function (a, b) {
    return a.time - b.time;
  });

  return responseObj;
};


const updateShortTermGoalCounter = (shortTermGoals, currentShortTermGoals) => {
  const currentShortTermGoalsMap = new Map();

  currentShortTermGoals.forEach(function(shortTermGoal) {
    const currentShortTermGoalId = shortTermGoal._id.toString();
    currentShortTermGoalsMap.set(currentShortTermGoalId, shortTermGoal.timesCompleted);
  })

  shortTermGoals.map(function(shortTermGoal) {
    const shortTermGoalId = shortTermGoal.id;

    if (shortTermGoalId !== "" && mongoose.Types.ObjectId.isValid(shortTermGoalId)) {
      shortTermGoal._id = mongoose.Types.ObjectId(shortTermGoalId);
    }

    if (currentShortTermGoalsMap.has(shortTermGoalId)) {
      shortTermGoal.timesCompleted = currentShortTermGoalsMap.get(shortTermGoalId);
    } else {
      shortTermGoal.timesCompleted = 0;
    }

    return shortTermGoal;
  })
}

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

    updateShortTermGoalCounter(shortTermGoals, currentGoal.shortTermGoals);

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
    if (await validateUserCompletedGoals(countIncrement, userId)) {
      const goalUpdateFilter = {"userId": userId, "shortTermGoals._id": shortTermGoalId};
      const goalUpdateQuery = {$inc: {"shortTermGoals.$.timesCompleted" : countIncrement}};
      const goalUpdateResult = await GoalModel.findOneAndUpdate(goalUpdateFilter, goalUpdateQuery);

      if (goalUpdateResult != null) {
        const userUpdateFilter = {"userId": userId};
        const userUpdateQuery = {$inc: {"goalsCompleted" : countIncrement}};
        const userUpdateResult = await UserModel.findOneAndUpdate(userUpdateFilter, userUpdateQuery);

        success = userUpdateResult != null ? true : false
      }
    } else {
      success = false;
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

// Validates that completed goals count would decrement below zero
const validateUserCompletedGoals = async (countIncrement, userId) => {
  if (countIncrement > 0) {
    return true;
  }

  const userFilter = {"userId": userId};
  const userResult = await UserModel.findOne(userFilter);

  return userResult.goalsCompleted > 0 ? true : false;
}

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

const maxLTGsInArray = 50;
const intervalRepopulatingTempLTGArray = 3000; // milliseconds

// call repopulateCacheLTGArray once upon database startup to ensure it is populated before it is used elsewhere
var done = false;
if (!done) {
    done = true;
    repopulateCacheLTGArray();
}

setInterval(function () {repopulateCacheLTGArray()}, intervalRepopulatingTempLTGArray);

async function repopulateCacheLTGArray() {
  let countLTGs = await GoalModel.countDocuments({});
  let numLTGsToSample = countLTGs<=maxLTGsInArray ? countLTGs : maxLTGsInArray;
  global.GlobalcacheLTGsArray = await GoalModel.aggregate([ { $sample: { size: numLTGsToSample }}]);
}

module.exports = { getGoalsResponseFromDBResult, getShortTermGoalsResponseFromDbResult, updateGoal, completeShortTermGoal, deleteLTG, repopulateCacheLTGArray}
