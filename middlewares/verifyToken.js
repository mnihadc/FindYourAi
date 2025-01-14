const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken; // Access token from cookies

  if (!token) {
    return res.redirect("/auth/login"); // Redirect to login if no token is found
  }

  try {
    // Verify the token and attach the decoded user info to req.user
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultSecret"
    );
    req.user = decoded; // Attach the user data to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.redirect("/auth/login"); // Invalid or expired token, redirect to login
  }
};

module.exports = verifyToken;
