const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: String,
  slug: String
});

module.exports = mongoose.model("Post", postSchema);
