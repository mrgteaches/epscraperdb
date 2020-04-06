$(document).ready(function () {

  $(".show-new").on("click", function (event) {

    $.getJSON("/entries", function (data) {

      for (var i = 0; i < data.length; i++) {

        if (data[i].courseTitle) {
          $("#subjectOne").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle + "<br />" + data[i].dayTitle + "</p>"
            + "<br />" + data[i].content + "<br />" + "</p>");
        }
        if (data[i].courseTitle2) {
          $("#subjectTwo").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle2 + "<br />" + data[i].dayTitle2 + "</p>"
            + "<br />" + data[i].content2 + "<br />" + "</p>");
        }
        if (data[i].courseTitle3) {
          $("#subjectThree").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle3 + "<br />" + data[i].dayTitle3 + "</p>"
            + "<br />" + data[i].content3 + "<br />" + "</p>")
        }
        if (data[i].courseTitle4) {
          $("#subjectFour").append("<p data-id='" + data[i]._id + "'>" + data[i].courseTitle4 + "<br />" + data[i].dayTitle4 + "</p>"
            + "<br />" + data[i].content4 + "<br />" + "</p>")
        }
      }
      var studentName = "Lee";
      $(".subjects").prepend("<h2>" + studentName + "</h2>");
    });
  });

  $(".scrape-new").on("click", function (event) {
    console.log("scrape");
    event.preventDefault();
    $.get("/scrape", function (data) {
      window.location.reload();
    });
  });



});
