const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Goal = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortTermGoals: [new Schema({
      title: { type: String, required: true },
      mon: { type: [Number] },
      tue: { type: [Number] },
      wed: { type: [Number] },
      thu: { type: [Number] },
      fri: { type: [Number] },
      sat: { type: [Number] },
      sun: { type: [Number] },
  } )],
  // Defining an object within an array schema element is implicitly 
  // treated as its own Schema object. As such they'll have their 
  // own _id field, which can be disabled by explicitly defining 
  // the schema with the _id option disabled
});

module.exports = mongoose.model("Goal", Goal);
