var express = require("express");

var router = express.Router();
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
// Import the model (burger.js) to use its database functions.


// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
    
        db.Article.find({}).then(function (articles) {
            res.render("index", {articles:articles});
        
    });
   
   
});
router.get("/notes", function (req, res) {
        db.Note.find({}).then(function (notes) {
            res.json(notes);
        });
    });
router.get("/articles", function (req, res) {
        db.Article.find({}).then(function (articles) {
            res.json(articles);
        });
    });

router.get("/articles/:id", function (req, res) {
        db.Article.findOne({
            _id: req.params.id
        }).populate("note").then(function (article) {
            res.json(article);
        }).catch(function (err) {
            res.json(err.message);
        });
    });
router.post("/articles/:id", function (req, res) {
        db.Note.create(req.body).then(function (note) {
            db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {note: note._id}}).then(function (article) {
                res.json(article);
            });
        });
    });
router.get("/delete-note/:id", function(req, res){
        console.log(req.params.id);
        db.Note.remove({_id: req.params.id}).then(function(){
            db.Article.update({"note": req.params.id}, {$set: {"note":null}}).then(function(){
                res.redirect('/');
            });
        });
        
    });
router.get("/api/scrape", function (req, res) {
        axios.get("https://www.nytimes.com/").then(function (response) {
            var $ = cheerio.load(response.data);
            $("article .story-heading").each(function (i, element) {
                var result = {};
                result.headline = $(this).children("a").text().trim();
                result.link = $(this)
                    .children("a")
                    .attr("href");
                result.byline = $(this).siblings(".byline").text().trim();
                result.summary = $(this).siblings(".summary").text().trim();
                db.Article.find({where: {link: result.link}}).then(function (article) {
                    console.log(article.length);
                    if (article.length < 1) {
                        db.Article.create(result).then(function (dbArticle) {
                        // If we were able to successfully scrape and save an Article, send a message to the client
                        // res.json(dbArticle);
                         // res.redirect("/");
                        }).catch(function (err) {
                        // If an error occurred, send it to the client
                        // res.json(err.message);
                        });
                    }
                });
            });
            res.redirect("/");
        });
    });
// Export routes for server.js to use.
module.exports = router;
