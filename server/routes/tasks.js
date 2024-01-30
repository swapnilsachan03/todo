import express from "express"
import { addTask, updateTask, deleteTask, getAllTasks } from "../controllers/task_controller.js"
import singleUpload from "../middlewares/multer.js"

const router = express.Router();

router.route("/tasks")
  .get(getAllTasks)
  .post(singleUpload, addTask)

router.route("/tasks/:id")
  .put(singleUpload, updateTask)
  .delete(deleteTask)

export default router
