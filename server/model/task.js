import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter task name"],
    minLength: [10, "Title must be at least 10 characters"],
    maxLength: [80, "Title must be at max 80 characters"],
  },
  
  done: {
    type: Boolean,
    default: false
  },

  image: {
    public_id: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Task = mongoose.model("Task", schema)
