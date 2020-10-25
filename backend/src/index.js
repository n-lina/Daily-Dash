const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors')
const debug = require("debug")("index.js");
const database = require('./db/database');
const firebase = require('./firebase/firebase');
const port = 3000;

app.use(cors())
app.use(bodyParser.json());

const goals = require("./goals/goals");
const users = require("./users/users");

app.use("/goals", goals);
app.use("/users", users);

app.listen(port, () =>
  debug(`Server listening on port ${port}!`),
);

module.exports.app = app;
