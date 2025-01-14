const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      minlength: [5, "Username must be at least 5 characters long."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      select: false, // Exclude password from query results
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address.",
      ],
    },
    profileImageUrl: {
      type: String,
      default:
        "https://via.placeholder.com/150/000000/FFFFFF/?text=User+Profile",
    }, //https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// Hash password before saving if it has been modified
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
