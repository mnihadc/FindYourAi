const express = require("express");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieParser = require("cookie-parser");
const path = require("path");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const homeRouter = require("./routes/home.route");
const authRouter = require("./routes/auth.route");
const authenticateUser = require("./middlewares/verifyToken");

require("dotenv").config();

const port = process.env.PORT_NO;
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Google Auth
app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://findyourai.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            profileImage: profile.photos[0]?.value,
          });
          await user.save();
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Routes for Google authentication
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    res.cookie("authToken", req.user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    res.render("users/ContactUs", {
      title: "Contact Us",
      isContactUsPage: true,
      user: req.user,
    });
  }
);

// Logout route
app.get("/logout", (req, res) => {
  const cacheKey = `user_${req.user?.userId}`;
  myCache.del(cacheKey);
  res.clearCookie("authToken");
  res.redirect("/login");
});

// Handlebars setup
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(handlebars),
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
  })
);
app.set("view engine", "hbs");
// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", homeRouter);
app.use("/auth", authRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
