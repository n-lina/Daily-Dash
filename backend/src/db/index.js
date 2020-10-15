const mongoose = require("mongoose");

const MONGO_USERNAME = process.env.CPEN321_MONGO_USER;
const MONGO_PASSWORD = process.env.CPEN321_MONGO_PASSWORD;
const MONGO_HOSTNAME = process.env.CPEN321_MONGO_HOSTNAME;
const MONGO_DB = process.env.CPEN321_MONGO_DB;

const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
