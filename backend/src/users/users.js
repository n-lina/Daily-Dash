const express = require("express");
const router = express.Router();

const UserModel = require('../models/users');

const addUser = (req, res) => {
  const { id } = req.body;
  const { email } = req.body;
  const { username } = req.body;

  if (id == null || email == null || username == null) {
    console.log(`Missing parameters in ${req.body}`);
    res.status(400);
    res.end();
    return;
  }

  const userObj = new UserModel({
    userId: id,
    email: email,
    username: username
  });

  userObj.save()
    .then((doc) => {
      console.log(doc);
    })
    .catch((err) => {
      console.error(err);
  });

  var response = res.json({email: email, username: username});

	res.send(response);
};

const getUser = async (req, res) => {
  const { id } = req.params;
  
  if (id == null) {
    console.log(`Missing parameters in ${req.body}`);
    res.status(400);
    res.end();
    return;
  }

  try {
    var result = await UserModel.findOne({userId: id});

    console.log(result);

    if (result == null) {
      res.status(400);
      res.send(null);
      return;
    }

    response = {email: result.email, username: result.username};

    res.send(response)
  } catch (error) {
    res.status(400);
    res.end();
    return;
  }
};

router.post("/", addUser);
router.get("/:id", getUser);

module.exports = router;
