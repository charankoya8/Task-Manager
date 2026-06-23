const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    dueDate: {
      type: String,
    },

    priority: {
      type: String,
      default: "Low",
    },

    category: {
      type: String,
      default: "Other",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Task",
  taskSchema
);