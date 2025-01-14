const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const app = express();

const homeRouter = require("./routes/home.route");
const authRouter = require("./routes/auth.route");
dotenv.config();

const port = process.env.PORT_NO;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(handlebars),
    layoutsDir: path.join(__dirname, "views", "layouts"),
  })
);

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/", homeRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
