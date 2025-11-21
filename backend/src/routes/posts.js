const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// GET all posts (with optional category filter + pagination)
router.get("/", async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// CREATE post
router.post("/", async (req, res) => {
  try {
    const { title, content, author, category, slug } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Validation failed" });
    }
    const post = await Post.create({ title, content, author, category, slug });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// UPDATE post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// DELETE post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

module.exports = router;