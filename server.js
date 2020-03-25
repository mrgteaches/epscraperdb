var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/epscraperdb", { useNewUrlParser: true });

// Routes

app.get("/scrape", function (req, res) {

  var result = {};
  var dayNo = "4";

  //clear the database before adding new content
  db.Entry.deleteMany({})
    .then(function (dbEntry) {
      console.log(dbEntry);
    })
    .catch(function (err) {
      console.log(err);
    });

  //first subject
  axios.get("https://www.allinonehighschool.com/trigonometryprecalculus/").then(function (response) {

    var $ = cheerio.load(response.data);

    result.courseTitle = $("header.entry-header")
      .children("h1")
      .text();

    result.dayTitle = $("div.entry-content")
      .children("p")
      .children("#day" + dayNo).text();

    result.content = $("div.entry-content")
      .children("p")
      .children("#day" + dayNo).parent().next("ol").text();

    db.Entry.create(result)
      .then(function (dbEntry) {
        console.log(dbEntry);
      })
      .catch(function (err) {
        console.log(err);
      });
  }); //closes axios.get

  //second subject
  axios.get("https://allinonehighschool.com/calculus/").then(function (response) {

    var $ = cheerio.load(response.data);

    result.courseTitle = $("header.entry-header")
      .children("h1")
      .text();

    result.dayTitle = $("div.entry-content")
      .children("p")
      .children("#day" + dayNo).text();

    result.content = $("div.entry-content")
      .children("p")
      .children("#day" + dayNo).parent().next("ol").text();

    db.Entry.create(result)
      .then(function (dbEntry) {
        console.log(dbEntry);
      })
      .catch(function (err) {
        console.log(err);
      });
  }); //closes axios.get

  //third subject
  axios.get("https://allinonehighschool.com/spanish-1-2018/").then(function (response) {

    var $ = cheerio.load(response.data);

    result.courseTitle = $("header.entry-header")
      .children("h1")
      .text();

    result.dayTitle = $("div.entry-content")
      .children("p")
      .children("#day" + dayNo).text();

    result.content = $("div.entry-content")
      .children("p")
      .children("#day" + dayNo).parent().next("ol").text();

    db.Entry.create(result)
      .then(function (dbEntry) {
        console.log(dbEntry);
      })
      .catch(function (err) {
        console.log(err);
      });
  }); // end third subject

  // Send a message to the client
  res.send("Scrape Complete");
}); //closes app.get

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Entries collection
  db.Entry.find({})
    .then(function (dbEntry) {
      // If we were able to successfully find Entries, send them back to the client
      res.json(dbEntry);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with its note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Entry.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbEntry) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbEntry);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Entry.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbEntry) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbEntry);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
