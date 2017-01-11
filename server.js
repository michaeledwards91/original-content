// Dependencies
var express = require("express");
var mongoose = require("mongoose");

// Requiring models
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

// Scrapin stuff
var request = require("request");
var cheerio = require("cheerio");

// Express init
var app = express();

// Static directory "public"
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/newsdb");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

