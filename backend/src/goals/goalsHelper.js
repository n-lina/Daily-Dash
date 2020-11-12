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
  let currentShortTermGoalsMap = new Map();

  currentShortTermGoals.forEach(function(shortTermGoal) {
    currentShortTermGoalsMap.set(shortTermGoal.title,shortTermGoal.timesCompleted);
  })

  shortTermGoals.map(function(shortTermGoal) {
    let shortTermGoalTitle = shortTermGoal.title;

    if (currentShortTermGoalsMap.has(shortTermGoalTitle)) {
      shortTermGoal.timesCompleted = currentShortTermGoalsMap.get(shortTermGoalTitle);
    } else {
      shortTermGoal.timesCompleted = 0;
    }

    return shortTermGoal;
  })
}

module.exports = { getGoalsResponseFromDBResult, getShortTermGoalsResponseFromDbResult, updateShortTermGoalCounter }
