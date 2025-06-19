const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Create
router.post("/", async (req, res) => {
  try {
    // Require userId in the body
    if (!req.body.userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const task = await Task.create(req.body); // will now include userId
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId query is required" });
    }
    const filter = { userId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.project) filter.project = req.query.project;
    if (req.query.tag) filter.tags = req.query.tag;
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read single (optional: check userId)
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Optional: Only allow if userId matches (require ?userId=...)
    if (req.query.userId && req.query.userId !== task.userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.userId !== userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    // Only allow update if user owns the task
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.userId !== userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
