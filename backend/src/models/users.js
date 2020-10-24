const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    notificationId: { type: String, required: true },
});

module.exports = mongoose.model("User", User);
