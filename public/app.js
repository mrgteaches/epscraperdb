$(document).ready(function () {

  // $(".show-new").on("click", function (event) {
  //   // Grab the articles as a json
  //   $.getJSON("/articles", function (data) {
  //     // For each one
  //     for (var i = 0; i < data.length; i++) {
  //       // Display the apropos information on the page
  //       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle + "<br />" + data[i].dayTitle + "</p>"
  //         + "<br />" + data[i].content + "<br />" + "</p>"
  //         + "<p data-id='" + data[i]._id + "'>" + data[i].courseTitle2 + "<br />" + data[i].dayTitle2 + "</p>"
  //         + "<br />" + data[i].content2 + "<br />" + "</p>"
  //         + "<p data-id='" + data[i]._id + "'>" + data[i].courseTitle3 + "<br />" + data[i].dayTitle3 + "</p>"
  //         + "<br />" + data[i].content3 + "<br />" + "</p>");
  //     }
  //   });
  // });

  //test
  $(".show-new").on("click", function (event) {
    // Grab the articles as a json
    $.getJSON("/articles", function (data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        if (data[i].courseTitle) {
          // Display the apropos information on the page
          $("#subjectOne").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle + "<br />" + data[i].dayTitle + "</p>"
            + "<br />" + data[i].content + "<br />" + "</p>");
        }
         if (data[i].courseTitle2) {
          $("#subjectTwo").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle2 + "<br />" + data[i].dayTitle2 + "</p>"
            + "<br />" + data[i].content2 + "<br />" + "</p>");
        } if (data[i].courseTitle3) {
          $("#subjectThree").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle3 + "<br />" + data[i].dayTitle3 + "</p>"
            + "<br />" + data[i].content3 + "<br />" + "</p>")

        }
      }
    });
  });
  //endtest


  //test
  // $(".show-new").on("click", function (event) {
  //   // Grab the articles as a json
  //   $.getJSON("/articles", function (data) {
  //     switch (data.courseTitle) {
  //       case "Spanish 1":
  //         $("#subjectOne").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle + "<br />" + data[i].dayTitle + "</p>"
  //           + "<br />" + data[i].content + "<br />" + "</p>");
  //         break;
  //       case "Calculus":
  //         $("#subjectTwo").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle + "<br />" + data[i].dayTitle + "</p>"
  //           + "<br />" + data[i].content + "<br />" + "</p>");
  //         break;
  //       case "Trigonometry/Pre-Calculus":
  //         $("#subjectThree").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle + "<br />" + data[i].dayTitle + "</p>"
  //           + "<br />" + data[i].content + "<br />" + "</p>");
  //         break;
  //     }
  //   });
  // });
  //end of test

  $(".scrape-new").on("click", function (event) {
    console.log("scrape");
    event.preventDefault();
    $.get("/scrape", function (data) {
      window.location.reload();
    });
  });

  // Whenever someone clicks a p tag
  $(document).on("click", "p", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.courseTitle + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

});
