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

  return responseObj;
}

const getShortTermGoalsResponseFromDbResult = (result, dayOfWeek) => {
  var _shortTermGoals = [];

  if (result == null) {
    return responseObj;
  }

  result.forEach(function (goal) {
    goal.shortTermGoals.forEach(function (shortTermGoal) {
      shortTermGoal[dayOfWeek].forEach(function (time) {
        shortTermGoalObj = {
          stgId: shortTermGoal._id,
          title: shortTermGoal.title,
          time: time
        };

        _shortTermGoals.push(shortTermGoalObj);
      });
    });
  });

  _shortTermGoals.sort(function (a, b) {
    return a.time - b.time;
  })

  var responseObj = {
    shortTermGoals: _shortTermGoals
  };

  return responseObj;
}

module.exports = { getGoalsResponseFromDBResult, getShortTermGoalsResponseFromDbResult }
