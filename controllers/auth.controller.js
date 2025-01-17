const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
// Render Login Page
const getLoginPage = (req, res, next) => {
  try {
    res.render("users/Login", {
      title: "FindYourAi - Login",
      getLoginpage: true,
    });
  } catch (error) {
    next(error);
  }
};

// Handle User SignUp
const SignUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).render("users/Login", {
        title: "Login Page",
        getLoginpage: true,
        signUpError: "All fields are required.",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).render("users/Login", {
        title: "Login Page",
        getLoginpage: true,
        signUpError: "User with this email already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Redirect to login page with a success message
    return res.redirect(
      "/auth/login?successMessage=Account created successfully!"
    );
  } catch (error) {
    console.error("SignUp Error:", error);

    // Handle specific Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).render("users/Login", {
        title: "Login Page",
        getLoginpage: true,
        signUpError: messages.join(", "),
      });
    }

    // Pass other errors to the global error handler
    next(error);
  }
};

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res.render("users/Login", {
        title: "Login Page",
        getLoginpage: true,
        loginError: "Email and password are required.",
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.render("users/Login", {
        title: "Login Page",
        getLoginpage: true,
        loginError: "No account found with this email.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render("users/Login", {
        title: "Login Page",
        getLoginpage: true,
        loginError: "Incorrect password. Please try again.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "defaultSecret",
      {
        expiresIn: "1h",
      }
    );

    // Set the cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.redirect("/");
  } catch (error) {
    console.error("Login Error:", error);
    next(error);
  }
};

module.exports = {
  getLoginPage,
  SignUp,
  Login,
};
