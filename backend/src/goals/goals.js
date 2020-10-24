const express = require("express");
const admin = require('firebase-admin');
const router = express.Router();

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
        id: goal._id,
        title: goal.title,
        description: goal.description,
        shortTermGoals: []
      };

      goal.shortTermGoals.forEach(function(shortTermGoal) {
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

  var response = {id: userId};

  res.send(response);
  
};


const getSuggestedShortTermGoal = async (req, res) => {

  var shortTermGoal = {
    title:"STG1", 
    mon:[5,15], 
    wed:[30,20]
  };

  const goalObj = new GoalModel({
    userId: "N/A",
    title: "N/A",
    description: "N/A",
    shortTermGoals: shortTermGoal
  });

  var response = goalObj.shortTermGoals;

  res.send(response);
  
};

router.get("/", getGoals);
router.get("/shortterm", getShortTermGoals);
router.post("/", postGoal);
router.get("/suggestedstg", getSuggestedShortTermGoal);

module.exports = router;
