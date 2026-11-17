import HelpPost from "../models/HelpPost.js";

export const createHelpPost = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }
    const post = await HelpPost.create({
      title,
      description,
      tags: tags || [],
      authorId: req.user._id,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHelpPosts = async (req, res) => {
  try {
    const { status, tag } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (tag) filter.tags = tag;

    const posts = await HelpPost.find(filter)
      .populate("authorId", "name avatar university department")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHelpPostById = async (req, res) => {
  try {
    const post = await HelpPost.findById(req.params.id)
      .populate("authorId", "name avatar university department")
      .populate("replies.userId", "name avatar university");
    if (!post) return res.status(404).json({ message: "Help post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyToHelpPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Reply text is required" });
    const post = await HelpPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Help post not found" });

    post.replies.push({ userId: req.user._id, text });
    await post.save();

    const populated = await HelpPost.findById(post._id)
      .populate("authorId", "name avatar university department")
      .populate("replies.userId", "name avatar university");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleHelpPostStatus = async (req, res) => {
  try {
    const post = await HelpPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Help post not found" });
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the author can change status" });
    }
    post.status = post.status === "open" ? "resolved" : "open";
    await post.save();
    res.json({ status: post.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHelpPost = async (req, res) => {
  try {
    const post = await HelpPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Help post not found" });
    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    await post.deleteOne();
    res.json({ message: "Help post removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};