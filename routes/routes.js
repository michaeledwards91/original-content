//Include Article and Note models
var Article = require("../models/Article");
var Note = require("../models/Note");

var mongoose = require("mongoose");

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

	app.get("/saved", function(req, res) {

		Article.find({saved: true}, function(err, data) {
			if (err) throw err;

			res.render("saved", {articles: data});
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

		    // var entry = new Article(result);

		    // entry.save(function(err, doc) {
		    // 	if (err) throw err;
		    // 	console.log(doc);
		    // });

		    Article.findOneAndUpdate(result, result, {upsert: true}, function(err, doc) {
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

	app.get("/api/notes", function(req, res) {
		Note.find({}, function(err, data) {
			if (err) throw err;
			res.json(data);
		});
	});

	app.get("/api/articles/:id", function(req, res) {

		var articleId = mongoose.Types.ObjectId(req.params.id);
		console.log(articleId);

		Article.findOne({_id: articleId}, function(err, doc) {
			res.json(doc);
		});	

	});

	app.get("/api/notes/:id", function(req, res) {

		var noteId = mongoose.Types.ObjectId(req.params.id);
		console.log(noteId);

		Note.findOne({_id: noteId}, function(err, doc) {
			res.json(doc);
		});	

	});

	app.get("/api/removenote/:id", function(req, res) {

		var noteId = mongoose.Types.ObjectId(req.params.id);
		console.log(noteId);

		Note.remove({_id: noteId}, function(err) {
			if (err) throw err;
			console.log("Note removed");
			res.redirect("/saved");
		});


	});

	//58783921ef834c64efcbd211

	app.get("/api/populatedarticle/:id", function(req, res) {

		var articleId = mongoose.Types.ObjectId(req.params.id);
		console.log(articleId);

		Article.findOne({_id: articleId})
		.populate("notes")
		.exec(function (err, doc) {
			if (err) handleError(err);
			res.json(doc);
		});

	});

	app.post("/api/articles/:id", function(req, res) {
		console.log(req.body);
		var noteInput = req.body.note;

		var articleId = mongoose.Types.ObjectId(req.params.id);
		console.log(articleId);

		var newNote = new Note({body: noteInput});
		newNote.save(function(err, doc) {
			if (err) throw err;

			Article.findOneAndUpdate({_id: articleId}, { $push: {notes: doc._id} }, function(err, articleDoc) {
				if (err) throw err;
				res.redirect("/saved");
			});
		});

		// Article.findOneAndUpdate({_id: articleId}, { $push: {notes: noteInput} }, function(err, doc) {
		// 	if (err) {
		// 		console.log(err);
		// 	} else {
		// 		res.send(doc);
		// 	}
		// });

	});

	//Route to display saved articles
	app.get("/api/saved", function(req, res) {
		//Page to display saved articles

		Article.find({saved: true}, function(err, data) {
			if (err) throw err;

			res.json(data);
		});

	});

	//Route to save articles
	app.get("/savearticle/:id", function(req, res) {
		
		var articleId = mongoose.Types.ObjectId(req.params.id);
		console.log(articleId);

		Article.findOneAndUpdate({_id: articleId}, { $set: {saved: true} }, function(err, doc) {

			if (err) throw err;

			console.log(doc);
		});

	});

	app.get("/unsavearticle/:id", function(req, res) {

		var articleId = mongoose.Types.ObjectId(req.params.id);
		console.log(articleId);

		Article.findOneAndUpdate({_id: articleId}, { $set: {saved: false} }, function(err, doc) {

			if (err) throw err;

			res.redirect("/saved");
		});

	});

}