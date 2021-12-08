const User = require('../models/user');
var bcrypt = require('bcrypt');

exports.loginWithEmail = async (req, res) => {   
    const {useremail, userpassword} = req.body;
    if(!useremail || !userpassword) {
        return res.status(400).json({
            status: "Fail",
            error: "Email and Password are required!"
        })
    }

    User.findOne({useremail},
        (err, user) => {
            if(user) {
                bcrypt.compare(userpassword, user.userpassword, function(err, isCorrect) {
                    if(isCorrect) {
                        req.session.userId = user._id;
                        // res.redirect('/');
                        res.status(200).json({
                            status: "Success",
                            body: user
                        });
                    } else {
                        res.status(400).json({
                            stats: 400,
                            error: "Invalid email or password"
                        })
                    }
                })
            } else {
                res.status(400).json({
                    stats: 400,
                    error: err
                })
            } 
        }
    )
}