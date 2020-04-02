var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

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
  var result2 = {};
  var result3 = {};
  var dayNo = "7";

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
      .children("#day" + dayNo).parent().next("ol").html();

    db.Entry.create(result)
      .then(function (dbEntry) {
        console.log(dbEntry);
      })
      .catch(function (err) {
        console.log(err);
      });
  }); //closes axios.get 

  // second subject
  axios.get("https://allinonehighschool.com/calculus/").then(function (response) {

    var $ = cheerio.load(response.data);

    result2.courseTitle2 = $("header.entry-header")
      .children("h1")
      .text();

    result2.dayTitle2 = $("div.entry-content")
      .children("p")
      .children("#day" + dayNo).text();

    result2.content2 = $("div.entry-content")
      .children("p")
      .children("#day" + dayNo).parent().next("ol").html();

    db.Entry.create(result2)
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

    result3.courseTitle3 = $("header.entry-header")
      .children("h1")
      .text();

    result3.dayTitle3 = $("div.entry-content")
      .children("p")
      .children("#day" + dayNo).text();

    result3.content3 = $("div.entry-content")
      .children("p")
      .children("#day" + dayNo).parent().next("ol").html();

    db.Entry.create(result3)
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

// Route for getting all entries from the db
app.get("/entries", function (req, res) {
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

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
