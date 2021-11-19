var express = require('express');
var router = express.Router();
var User = require('../../models/user.js');

router.route('/')
    .get((req, res) => {
        res.render('register.ejs');
    })
    .post((req, res) => {
        var newuser = new User({
            username: req.body.username,
            useremail: req.body.useremail,
            userpassword: req.body.userpassword,
            avatar: 'avatar.png'
        })
        newuser.save(err => {
            if(err)
                return res.redirect('/register');
            res.redirect('/signin');
        });
    })

module.exports = router;