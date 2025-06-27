const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("./middlewares/logger");
const urlRoutes = require("./routes/urlRoutes");

dotenv.config();
const DB = process.env.MONGO_URI;

const app = express();
app.use(express.json());
app.use(logger);
app.use("/", urlRoutes);

mongoose.connect(DB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("DB connection error:", err));