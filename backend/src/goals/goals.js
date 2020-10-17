const express = require("express");
const router = express.Router();

const GoalModel = require('../models/goals');

const getGoal = async (req, res) => {
  const { id } = req.params;
  
  if (id == null) {
    console.log(`Missing parameters in ${req.body}`);
    res.status(400);
    res.end();
    return;
  }

  try {
    var result = await GoalModel.findOne({userId: id});

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

router.get("/:id", getGoal);

module.exports = router;
