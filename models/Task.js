const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    note: { type: String, default: "" },
    tags: [{ type: String }], // Array for multi-tag support
    status: {
      type: String,
      enum: ["todo", "progress", "done"],
      default: "todo",
      required: true,
    },
    project: { type: String, required: true },
    // MongoDB auto-generates _id as id
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
