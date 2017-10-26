
  // When you click the savenote button

// Grab the articles as a json


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
      if(data.note){
        cardBlockDiv.append("<button class='btn btn-danger' data-id='"+data.note._id+"'  id='deletenote'>Delete Note</button>");
      
      }
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


$(document).on("click", "#deletenote", function(){
  var thisId = $(this).attr("data-id");

      $.ajax({
    method: "GET",
    url: "/delete-note/" + thisId
  })
    // With that done
    .done(function(data) {
      // Log the response
      
      // Empty the notes section
      $("#titleinput").val("");
  $("#bodyinput").val("");
      $("#notes").empty();
    }).catch(function(error){
      console.log(error);
    });

  // Also, remove the values entered in the input and textarea for note entry
  
});


