var express = require('express');
const User = require('../../models/user');
var router = express.Router();
var bcrypt = require('bcrypt');

router.route('/')
    .get((req, res) => {
        res.render('signin.ejs');
    })
    .post((req, res) => {
        User.findOne({useremail: req.body.useremail},
            (err, user) => {
                if(user) {
                    bcrypt.compare(req.body.userpassword, user.userpassword, function(err, isCorrect) {
                        console.log(isCorrect);
                        if(isCorrect) {
                            req.session.userId = user._id;
                            res.redirect('/')
                        } else {
                            res.redirect('/signin')
                        }
                    })
                } else {
                    res.redirect('/signin')
                } 
            }
        )
    })

module.exports = router;