const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LongTermGoal = new Schema({
    properties: {
        userId: { type: String, required: true },
        description: { type: String, required: true }
    }
});

module.exports = mongoose.model("LongTermGoal", LongTermGoal);
