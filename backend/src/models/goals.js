const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Goal = new Schema({
    properties: {
        userId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        shortTermGoals: [{
          title: { type: String, required: true },
          description: { type: String, required: true },
          mon: { type: Date, required: true },
          tue: { type: Date, required: true },
          wed: { type: Date, required: true },
          thu: { type: Date, required: true },
          fri: { type: Date, required: true },
          sat: { type: Date, required: true },
          sun: { type: Date, required: true },
        }],
    }
});

module.exports = mongoose.model("Goal", Goal);
