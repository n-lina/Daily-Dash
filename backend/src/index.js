const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const debug = require("debug")("index.js");

const port = 3000;

app.use(bodyParser.json());

const goals = require("./goals/goals");

app.use("/goals", goals)

app.listen(port, () =>
  debug(`Server listening on port ${port}!`),
);


