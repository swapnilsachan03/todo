import express from "express"
import dotenv from "dotenv"
import ErrorMiddleware from "./middlewares/error.js"
import cors from "cors"

dotenv.config({
  path: ".env"
})

const app = express()

// Using middlewares

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}))

// Importing & using routes

import task from "./routes/tasks.js";
app.use("/api/", task);

export default app;

app.get("/", (req, res) => {
  res.send(`<h1>Working pretty fine, click <a href=${process.env.FRONTEND_URL}>here</a> to visit front-end.</h1>`)
})

app.use(ErrorMiddleware)
