const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

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

module.exports = { getLoginPage, SignUp };
