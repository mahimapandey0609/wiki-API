const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended : true }));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
const wikiSchema = {
    title: String,
   content: String
};
const Article = mongoose.model("Article", wikiSchema);

app.route("/articles")
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
   
  });
})
.post(function(req, res){

  const newArticle = new Article({
   title :  req.body.title,
   content : req.body.content
  });
  newArticle.save(function(err){
    if(!err){
     res.send("successfully added new article.");
    }else{
    res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    }else{
      res.send(err);
    }
  });
  });



  app.route("/articles/:articleTitle")
  .get(function(req, res){
   Article.findOne({title : req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No  article matching that title was found");
    }
   });
  })

  .put(function(req,res){
    Article.update(
      {title :  req.params.articleTitle},
      {title: req.body.title , content : req.body.content},
      // {overwrite :true},
      function(err){
        if(!err){
          res.send("Successfully updated articles");
        }
  });
  })

  .patch(function(req, res){
    // console.log(req.body);
    Article.updateOne(
      
      {title :  req.params.articleTitle},
      {$set : req.body},
       function(err){
        if(!err){
          res.send("Successfully updated specific article");
        }
  });
      
  })
  .delete(function(req,res){
    Article.deleteOne(
      // {title : req.body.title},
      {title: req.params.articleTitle },
      function(err){
        if(!err){
          res.send("Deleted the record");
        }
      }
    );
  });

// app.get("/articles" , );

// app.post("/articles" , );

// app.delete("/articles", );

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });