var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var logger = require("morgan");
var mongoose = require("mongoose");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("./models");;

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));




// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// Override various requests..
app.use(methodOverride("_method"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
var MONGODB_URI = "mongodb://heroku_gstclm7g:7kcn9rkjrg34e9j29ocnpmp7pa@ds125555.mlab.com:25555/heroku_gstclm7g";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});



// Import routes and give the server access to them.
var routes = require("./controllers/routes.js");

app.use("/", routes);
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});




