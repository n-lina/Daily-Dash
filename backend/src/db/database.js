const mongoose = require("mongoose");
const logger = require("../logger/logging");

const url = `mongodb://localhost:27017/dailydashdb`;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
      .then(() => {
        logger.info("Database connection successful.");
      })
      .catch((err) => {
        logger.info("Database connection error.", err);
      });
  }
}

module.exports = new Database();
