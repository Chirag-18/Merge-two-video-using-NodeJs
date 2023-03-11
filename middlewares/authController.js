const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const catchAsync = require("../utility/catchAsync");
const AppError = require("../utility/appError");

exports.protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(AppError("Unauthorized! Login or Signup first.", 400));
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: decoded.userId });

  if (!user) {
    return next(new AppError("User not found", 401));
  }

  req.user = user;
  next();
});