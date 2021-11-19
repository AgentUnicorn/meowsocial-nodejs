var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var Post = require("../models/post.js");

router.get("*", function (req, res, next) {
  res.locals.userId = req.session.userId;
  console.log(req.session.usernow)
  next();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  if (res.locals.userId) {
    User.findOne({_id: req.session.userId}, (err, user) => {
      Post.find({})
        .populate('postAuthor')
        .populate({
          path: 'comments',
          populate: {
            path: 'cmtAuthor'
          }
        })
        .exec((err, data) => {
          if(err) return console.log(err);
          data = data.reverse();
          res.render('index.ejs', {user, data});
        });
    })
  } else {
    res.redirect("/signin");
  }
});

router.get("/signout", function (req, res) {
  req.session.userId = undefined;
  res.redirect("/signin");
});

module.exports = router;
