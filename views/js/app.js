
  // When you click the savenote button

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var cardDiv = $("<div>");
    cardDiv.addClass("card");
    cardDiv.addClass("mb-2 p-2");
    var cardBlockDiv = $("<div>");
    cardBlockDiv.addClass("card-block");
    var header = $("<h4>");
    header.addClass("card-title");
    header.html(data[i].headline);
    var byLine = $("<h6>");
    byLine.html(data[i].byline);
    byLine.addClass("card-subtitle mb-2 text-muted");
    var summary = $("<div>");
    summary.addClass("card-text");
    summary.html(data[i].summary);
    var article = $("<a>");
    article.attr("href", data[i].link);
    article.attr("target", "_blank");
    article.html("Go to Article");
    article.addClass("btn btn-info");
    
    var notes = $("<p>");
    notes.addClass("btn btn-warning");
    notes.attr("data-id", data[i]._id);
    notes.html("Article Notes");
    
    cardBlockDiv.append(header);
    cardBlockDiv.append(byLine);
    cardBlockDiv.append(summary);
    cardBlockDiv.append(article);
    cardBlockDiv.append(notes);

    cardDiv.append(cardBlockDiv);
    $("#articles").append(cardDiv);
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link +"<br /><br />" + data[i].byline   +"<br /><br />"  + data[i].summary + "</p>");
    // $("#articles").append("<a class='btn btn-info' href="+data[i].link+" target='_blank'>Go to article</a>");
    // $("#articles").append("<button class='btn btn-warning' data-id='"+data[i]._id+"'>Article Notes</button><hr>")
    // $("#articles").append("<p data-id='" + data[i]._id + "'>Alex</p>");

    

  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
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
    .done(function(data) {
      // console.log(data);

      var cardDiv = $("<div>");
      cardDiv.addClass("card");
      cardDiv.addClass("mb-2 p-2");
      var cardBlockDiv = $("<div>");
      cardBlockDiv.addClass("card-block");
      var header = $("<h4>");
      header.addClass("text-info");
      header.addClass("card-title");
      header.html(data.headline);

      cardBlockDiv.append(header);
      cardBlockDiv.append("<input class='form-control' placeholder='Note Title'  id='titleinput' name='title' >");
      cardBlockDiv.append("<textarea  style='min-height:250px' class='form-control' placeholder='Note Body' id='bodyinput' name='body'></textarea>");
      cardBlockDiv.append("<button class='btn btn-primary' data-id='"+data._id+"'  id='savenote'>Save Note</button>");
      cardDiv.append(cardBlockDiv);
      
      $("#notes").append(cardDiv);
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function() {
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
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
