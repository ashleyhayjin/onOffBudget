const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongConnect = require("./mongoose.js");
const compression = require("compression");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


// routes
app.use(require("./routes/api.js"));


mongConnect.once("open", () => {
  app.listen(PORT, function() {
    console.log("Server started on port");
  });
})