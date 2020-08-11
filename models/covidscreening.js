/**
 * Author : Ram prasath Meganathan (B00851418)
 * Db model for covidtest table to store the covid test results
 */
const mongoose = require("mongoose");
const covidscreening = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
    },
    covidpositive: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("covidscreening", covidscreening);