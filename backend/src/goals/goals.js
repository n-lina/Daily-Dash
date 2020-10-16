const express = require("express");
const router = express.Router();

const addLongTermGoal = (req, res) => {
  const { userId } = req.body;
  const { description } = req.body;

  if (userId == null || description == null) {
    console.log(`Missing parameters in ${req.body}`);
    res.status(400);
    res.end();
    return;
  }

	res.send("added goal");
}

router.post("/longterm", addLongTermGoal);

module.exports = router;
