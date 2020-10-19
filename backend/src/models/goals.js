const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Goal = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortTermGoals: [{
      title: { type: String, required: true },
      description: { type: String, required: true },
      mon: [{
        minute: {type: Number, required: false}
      }],
      tue: [{
        minute: {type: Number, required: false}
      }],
      wed: [{
        minute: {type: Number, required: false}
      }],
      thu: [{
        minute: {type: Number, required: false}
      }],
      fri: [{
        minute: {type: Number, required: false}
      }],
      sat: [{
        minute: {type: Number, required: false}
      }],
      sun: [{
        minute: {type: Number, required: false}
      }],
    }],
});

module.exports = mongoose.model("Goal", Goal);
