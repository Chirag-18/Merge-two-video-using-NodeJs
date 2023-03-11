const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unquie: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value) => {
        return validator.default.isEmail(value);
      },
      message: "Invalid Email Address",
    },
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },

  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    validate: {
      validator: (value) => {
        return validator.default.isAlpha(value, "en-US", { ignore: "_" });
      },
      message: "First name can only contain letters, spaces and hyphens",
    },
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    validate: {
      validator: (value) => {
        return validator.default.isAlpha(value, "en-US", { ignore: "_" });
      },
      message: "First name can only contain letters, spaces and hyphens",
    },
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;