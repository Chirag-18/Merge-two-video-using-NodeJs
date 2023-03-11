const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routers/userRouter");
const videoRouter = require("./routers/videoRouter");


const globalErrorHandler = require("./middlewares/globalErrorHandler");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use(express.static(__dirname + "/tmp"));
app.use("/tmp", express.static("tmp"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connect To Database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/users", userRouter);
app.use("/api/video", videoRouter);

app.use(globalErrorHandler);

module.exports = app;