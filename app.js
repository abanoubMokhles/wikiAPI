/*=======================
    Require Packages
=======================*/
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

/*=======================
        Setup App
=======================*/
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

/*=======================
    Database Setup
=======================*/
mongoose.connect("mongodb://localhost:27017/wikiDb");

const articlesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Article's Title is required"]
    },
    content: {
        type: String,
        required: [true, "Article's Content is required"]
    }
});

const Article = mongoose.model("Article", articlesSchema);

/*============================================================
        GET - POST - DELETE REQUESTS TO /articles ROUTE
============================================================*/
app.route("/articles")
    /*------------------------
        GET All Articles
    ------------------------*/
    .get(function(req, res){
        Article.find(function(err, foundArticles){
            if(! err){
                res.send(foundArticles);
            }else{
                res.send(err);
            }
        });
    })
    
    /*-----------------------
        POST New Article
    -----------------------*/
    .post(function(req, res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err){
            if(! err){
                res.send("Post added Successfully.");
            }else{
                res.send(err);
            }
        });
    })

    /*------------------------
        DELETE All Articles
    ------------------------*/
    .delete(function(req, res){
        Article.deleteMany(function(err){
            if(! err){
                res.send("All Articles were deleted with success.");
            }else{
                res.send(err);
            }
        });
    });

/*============================================================================
    GET - POST - DELETE - PUT - PATCH REQUESTS TO /articles/:article ROUTE
============================================================================*/
app.route("/articles/:articleTitle")
    /*------------------------
        GET Specific Article
    ------------------------*/
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if(! err){
                if(foundArticle){
                    res.send(foundArticle);
                }else{
                    res.send("Article Not Found.");
                }
            }else{
                res.send(err);
            }
        });
    })
    /*---------------------------------------
        REPLACE Specific Article
    ---------------------------------------*/
    .put(function(req, res){
        Article.replaceOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            function(err){
                if(! err){
                    res.send("Article Replaced successfully");
                }else{
                    res.send(err);
                }
            }
        )
    })
    /*---------------------------------------
        UPDATE Specific Article
    ---------------------------------------*/
    .patch(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(! err){
                    res.send("Article Updated successfully");
                }else{
                    res.send(err);
                } 
            }
        )
    })
    /*---------------------------------------
        DELETE Specific Article
    ---------------------------------------*/
    .delete(function(req, res){
        Article.deleteOne({title: req.params.articleTitle}, function(err){
            if(! err){
                res.send("Article Deleted successfully");
            }else{
                res.send(err);
            }
        });
    });



/*=======================
        Run Server
=======================*/
let port = process.env.PORT;
if(port == "" || port == null){
    port = 3000;
}
app.listen(port, function(){
    console.log("Server live");
});