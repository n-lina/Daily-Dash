const express = require("express");
const router = express.Router();

const GoalModel = require('../models/goals');

const getGoal = async (req, res) => {
  const { id } = req.query;

  console.log("hit");

//   const goalObj = new GoalModel({
//     userId: id,
//     title: "test",
//     description: "test",
//     shortTermGoals: [{
//       title: "test",
//       description: "test",
//       mon: [
//         {
//           minute: 700  
//         },
//         {
//           minute: 600
//         }],
//       tue: [],
//       wed: [],
//       thu: [],
//       fri: [],
//       sat: [],
//       sun: [],
//     }],
// });

//   await goalObj.save()
//     .then((doc) => {
//       console.log(doc);
//     })
//     .catch((err) => {
//       console.error(err);
//   });

  
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

    res.send(result)
  } catch (error) {
    res.status(400);
    res.end();
    return;
  }
};

const getShortTermGoals = async (req, res) => {
  const { id } = req.query;
  const { dayOfWeek } = req.query;

  console.log("hit");

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

    let shortTermGoals = [];

    result.forEach(function(goal) {
      goal.shortTermGoals.forEach(function(shortTermGoal) {
        if (shortTermGoal[dayOfWeek].length > 0) {
          shortTermGoals.push(shortTermGoal);
        }
      });
    });

    console.log(shortTermGoals);

    res.send(shortTermGoals)
  } catch (error) {
    res.status(400);
    res.end();
    return;
  }
};

router.get("/", getGoal);
router.get("/shortterm", getShortTermGoals);

module.exports = router;
