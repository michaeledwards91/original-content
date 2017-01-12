//Include Article and Note models
var Article = require("../models/Article");
var Note = require("../models/Note");

//Scrape Tools
var request = require("request");
var cheerio = require("cheerio");

module.exports = function (app) {

	app.get("/", function(req, res) {

		Article.find({}, function(err, data) {
			if (err) throw err;

			res.render("index", {articles: data});
		});
		
	});

	//Route that scrapes
	app.get("/scrape", function(req, res) {
		//Scrape articles with cheerio
		//Insert articles into db with mongoose model

		request('https://news.google.com/', function (error, response, html) {

			// Load the HTML into cheerio and save it to a variable
		  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
		  var $ = cheerio.load(html);

		  // Select each instance of the HTML body that you want to scrape
		  // NOTE: Cheerio selectors function similarly to jQuery's selectors, 
		  // but be sure to visit the package's npm page to see how it works
		  $('h2.esc-lead-article-title').each(function(i, element){

		  	var result = {};

		    result.link = $(element).children().attr("href");
		    result.title = $(element).children().text();

		    var entry = new Article(result);

		    entry.save(function(err, doc) {
		    	if (err) throw err;
		    	console.log(doc);
		    });

		    });

	});

	}); //End of scrape route

	app.get("/api/articles", function(req, res) {

		Article.find({}, function(err, data) {
			if (err) throw err;

			res.json(data);
		});

	});

	app.get("/saved", function(req, res) {
		//Page to display saved articles
		console.log("Nothing here yet");
	});

}