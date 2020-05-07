var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

// var PORT = 3000;
var PORT = process.env.PORT || 3000;

var coursesList = ["https://allinonehomeschool.com/reading-4/", "https://allinonehomeschool.com/math/", "https://allinonehomeschool.com/language-arts-3/", "https://allinonehomeschool.com/history-year-1/"];
var studentName = "Lee";

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
// mongoose.connect("mongodb://localhost/epscraperdb", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/epscraperdb";

mongoose.connect(MONGODB_URI);

// Routes

app.get("/", function (req, res) {
  var resultHold = {};
  var dayNo = 53;

  //clear the database before adding new content
  db.Entry.deleteMany({})
    .then(function (dbEntry) {
      console.log(dbEntry);
    })
    .catch(function (err) {
      console.log(err);
    });

  for(var i=0; i<coursesList.length; i++){
  var course = coursesList[i];

  axios.get(course).then(function (response) {

    var $ = cheerio.load(response.data);

    resultHold.studentName = studentName;
    resultHold.course = course;

    resultHold.courseTitle = $("header.entry-header")
      .children("h1")
      .text();

    resultHold.content = $("div.entry-content")
      .find("#day" + dayNo).html();

    db.Entry.create(resultHold)
      .then(function (dbEntry) {
        console.log(dbEntry);
      })
      .catch(function (err) {
        console.log(err);
      });
  }); //closes axios.get 
  };//closes for loop for courses

  // Send a message to the client
  res.send("Scrape Complete");
}); //closes app.get

// Route for getting all entries from the db
app.get("/entries", function (req, res) {
  // Grab every document in the Entries collection
  db.Entry.find()
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
