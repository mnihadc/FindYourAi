const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const port = process.env.PORT_NO;

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
