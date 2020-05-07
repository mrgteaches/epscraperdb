$(document).ready(function () {
  var courseTitle;
  var content;

  $(".show-new").on("click", function (event) {
    $(".show-new").css("display", "none");
        $.getJSON("/entries", function (data) {
             for (var i = 0; i < data.length; i++) {
                    $("#subjects").append("<h2>" + data[i].studentName + "</h2><p>" + data[i].courseTitle
                 + "<br />" + data[i].content + "<br />" + "</p>")
               }   
      });
      });
      
    $.get("/", function (data) {
    });


});
