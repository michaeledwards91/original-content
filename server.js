// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

// Requiring models
var Article = require("./models/Article.js");
var Note = require("./models/Note.js");

// Scrapin stuff
var request = require("request");
var cheerio = require("cheerio");

// Express init
var app = express();
var PORT = process.env.PORT || 3000;

//Body Parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory "public"
app.use(express.static("public"));

// Handlebars setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set("view engine", "handlebars");

// Database configuration with mongoose
var connectionUrl = process.env.MONGODB_URI || "mongodb://localhost/newsdb";
mongoose.connect(connectionUrl);
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Require routes
require("./routes/routes.js")(app);

// Listen on port 3000
app.listen(PORT, function() {
	console.log("App listening on PORT " + PORT);
});
