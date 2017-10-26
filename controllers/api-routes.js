// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");


// =============================================================
module.exports = function (app) {
    "use strict";
    app.get("/api/scrape", function (req, res) {
        // First, we grab the body of the html with request
        axios.get("https://www.nytimes.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            // Now, we grab every h1 within an article tag, and do the following:
            $("article .story-heading").each(function (i, element) {
              
                // Save an empty result object
                var result = {};
                
                
                // Add the text and href of every link, and save them as properties of the result object
                
                result.headline = $(this).children("a").text().trim();
                result.link = $(this)
                    .children("a")
                    .attr("href");
                  // console.log(result);
                result.byline = $(this).siblings(".byline").text().trim();
                // result.byline = $(this).next(".small-thumb").children(".byline").text().trim();
                result.summary = $(this).siblings(".summary").text().trim();
                // console.log(result);
                // Create a new Article using the `result` object built from scraping
                db.Article.find({where:{link:result.link}}).then(function(article){
                    console.log(article.length);
                    if(article.length<1){
                        db.Article
                        .create(result)
                        then(function (dbArticle) {
                        // If we were able to successfully scrape and save an Article, send a message to the client
                        // res.json(dbArticle);
                         // res.redirect("/");
                        })
                        .catch(function (err) {
                        
                        // If an error occurred, send it to the client
                        // res.json(err.message);
                        });
                    }
                });
                
            });
            // db.Article.find().then(function(articles){res.json(articles);});
            res.redirect("/");
        });
    });
    app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
        db.Article.find({}).then(function (articles) {
            res.json(articles);
        });
    });
    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({
            _id: req.params.id
        }).populate("note").then(function (article) {
            res.json(article);
        }).catch(function (err) {
            res.json(err.message);
        });
    });
    app.post("/articles/:id", function (req, res) {
        
        db.Note.create(req.body).then(function (note) {
            

            db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {note: note._id}}).then(function ( article) {
               
                  res.json(article);
                
                
            });
        });
    });
};