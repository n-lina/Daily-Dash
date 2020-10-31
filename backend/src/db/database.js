const mongoose = require('mongoose');

const url = `mongodb://localhost:27017/dailydashdb`;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
      .then(() => {
        console.log('Database connection successful.');
      })
      .catch((err) => {
        console.error('Database connection error.', err);
      });
  }
}

module.exports = new Database();
