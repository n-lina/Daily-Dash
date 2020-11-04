const express = require("express");
const router = express.Router();

const logger = require("../logger/logging");
const UserModel = require("../models/users");

const addUser = async (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const username = req.body.username;
  const notificationId = req.body.notificationId;

  if (id == null || email == null || username == null) {
    logger.info(`Missing parameters in ${req.body}`);
    res.status(400);
    res.end();
    return;
  }

  const userObj = {
    userId: id,
    email,
    username,
    notificationId
  };

  const query = {"userId": id};

  UserModel.findOneAndUpdate(query, userObj, {upsert: true}).then((doc) => {
    logger.info(doc);
  })
  .catch((err) => {
    logger.info(err);
  });

  var response = {email: email, username: username};

	res.send(response);
};

const getUser = async (req, res) => {
  const id = req.params.id;
  
  if (id == null) {
    logger.info(`Missing parameters in ${req.body}`);
    res.status(400);
    res.end();
    return;
  }

  try {
    var result = await UserModel.findOne({userId: id});

    logger.info(result);

    if (result == null) {
      res.status(400);
      res.send(null);
      return;
    }

    var response = {email: result.email, username: result.username};

    res.send(response);
  } catch (error) {
    res.status(400);
    res.end();
    return;
  }
};

const expireNotificationToken = async (req, res) => {
  const id = req.params.id;
  const token = req.query.token;
  
  if (id == null || token == null) {
    logger.info(`Missing parameters in ${req.body}`);
    res.status(400);
    res.end();
    return;
  }

  const userObj = {
    notificationId: "",
  };

  const query = {"userId": id, "notificationId": token};

  UserModel.findOneAndUpdate(query, userObj, {upsert: false}).then((doc) => {
    logger.info(doc);
  })
  .catch((err) => {
    logger.info(err);
  });

  var response = {userId: id};

	res.send(response);
};

router.post("/", addUser);
router.get("/:id", getUser);
router.delete("/:id/notification", expireNotificationToken);

module.exports = router;
