const getGoalsResponseFromDBResult = (result) =>  {
  const responseObj = {
    longTermGoals: []
  };

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

  return responseObj;
}

module.exports = {getGoalsResponseFromDBResult, getShortTermGoalsResponseFromDbResult}