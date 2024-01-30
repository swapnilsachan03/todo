import { catchAsyncError } from "../middlewares/catch_async_error.js"
import { Task } from "../model/task.js"
import getDataURI from "../utils/data_uri.js"
import ErrorHandler from "../utils/error_handler.js"
import cloudinary from "cloudinary"

export const getAllTasks = catchAsyncError(async (req, res, next) => {
  const tasks = await Task.find({}).sort({ createdAt: "desc" });

  res.status(200).json({
    success: true,
    tasks
  })
})

export const addTask = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  const file = req.file;
  
  const fileURI = getDataURI(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileURI.content);

  if(!name || !file) {
    return next(new ErrorHandler(
      "Please provide both task name & image,", 400
    ));
  }
  
  await Task.create({
    name,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    }
  });

  res.status(201).json({
    success: true,
    message: "Task added successfully"
  })
})

export const updateTask = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);

  if(!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  const { name, done } = req.body;
  const file = req.file;

  var myCloud;
  if (file) {
    const fileURI = getDataURI(file);
    myCloud = await cloudinary.v2.uploader.upload(fileURI.content);
  }

  if(!name) {
    return next(new ErrorHandler(
      "Please provide task name", 400
    ));
  }

  await cloudinary.v2.uploader.destroy(task.image.public_id);
  await task.updateOne({
    name,
    done: done || false,
    image: file ? {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    } : {
      public_id: task.image.public_id,
      url: task.image.url
    }
  });

  res.status(200).json({
    success: true,
    message: "Task updated successfully"
  })
})

export const deleteTask = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  
  if(!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  await cloudinary.v2.uploader.destroy(task.image.public_id);
  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task removed successfully"
  })
})
