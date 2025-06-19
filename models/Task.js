const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    note: { type: String, default: "" },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["todo", "progress", "done"],
      default: "todo",
      required: true,
    },
    project: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
