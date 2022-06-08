const { model, Schema } = require("mongoose");

module.exports = model("Page", new Schema({
    title: String,
    content: String
}));