const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  profileImageUrl: {
    type: String,
    default:
      "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
  },
});

// Middleware to update `lastUpdate` on save
userSchema.pre("save", function (next) {
  this.lastUpdate = new Date();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
