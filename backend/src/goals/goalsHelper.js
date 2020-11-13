var mongoose = require('mongoose');

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

module.exports = { getGoalsResponseFromDBResult, getShortTermGoalsResponseFromDbResult, updateShortTermGoalCounter }
