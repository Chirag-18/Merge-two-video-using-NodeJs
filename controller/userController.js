const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const catchAsync = require("../utility/catchAsync");
const AppError = require("../utility/appError");
const User = require("../models/userModel");

require("dotenv").config();

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    return next(new AppError("User with this email already exists."));
  }

  if (!email || !password || !firstName || !lastName) {
    return next(
      new AppError("Email, password, firstname & lastname is required", 400)
    );
  }

  if (!validator.default.isEmail(email)) {
    return next(new AppError("Email is invalid.", 400));
  }

  if (password.length < 8 || password.length > 60) {
    return next(
      new AppError("Password must be between 8 and 64 characters long", 400)
    );
  }

  if (firstName.length < 2 || firstName.length > 50) {
    return next(
      new AppError("First name must be between 2 and 50 characters long")
    );
  }

  if (lastName.length < 2 || lastName.length > 50) {
    return next(
      new AppError("First name must be between 2 and 50 characters long")
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

  res.status(201).json({
    messgae: "User has been created",
    token: token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Incorrect email or password", 400));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect === false) {
    return next(new AppError("Incorrect email or password", 400));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.status(200).json({
    message: "Logged in Successfully",
    token: token,
  });
});