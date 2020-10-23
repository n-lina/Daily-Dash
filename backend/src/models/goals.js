const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Goal = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortTermGoals: [new Schema({
      title: { type: String, required: true },
      description: { type: String, required: true },
      mon: { type: [Number], unique: true },
      tue: { type: [Number], unique: true },
      wed: { type: [Number], unique: true },
      thu: { type: [Number], unique: true },
      fri: { type: [Number], unique: true },
      sat: { type: [Number], unique: true },
      sun: { type: [Number], unique: true },        
  } )],
  // Defining an object within an array schema element is implicitly 
  // treated as its own Schema object. As such they'll have their 
  // own _id field, which can be disabled by explicitly defining 
  // the schema with the _id option disabled
});

module.exports = mongoose.model("Goal", Goal);
