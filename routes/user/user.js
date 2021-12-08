var express = require('express');
var router = express.Router();
const {
    getUserProfile,
    updateUserProfile
} = require('../../controller/userCtrl');

// localhost:8080/user/...

// Get userid from session into locals
router.route('*')
    .get((req, res, next) => {
        res.locals.userId = req.session.userId;
        next();
    })

// Get user profile route 
router.route('/:id')
    .get(getUserProfile)

// Update user info route 
router.route('/update/:id')
    .post(updateUserProfile)

router.route('/follow')
    .post((req, res) => {
        var followingId = req.body.following;
        var action = req.body.action;
        switch(action) {
            case 'follow': 
                //Find current logged in user and push following 
                //user id into following arr
                User.findOne({_id: req.session.userId}, (err, userProfile) => {
                    if(userProfile.following.some(u => u == followingId)) {
                        console.log("already followed");
                    } else {
                        userProfile.following.push(followingId);
                        User.findOne({_id: followingId}, (err, followingUser) => {
                            followingUser.followers.push(req.session.userId);
                            followingUser.save(err=> {
                                userProfile.save(err => {res.redirect('/user/'+followingId)})
                            })
                        })
                    }
                });

                break;

            case 'unfollow':
                User.findOne({_id: req.session.userId}, (err, userProfile) => {
                    if(userProfile.following.some(u => u != followingId)) {
                        console.log("u havent follow this user");
                    } else {
                        var pos = userProfile.following.indexOf(followingId);
                        userProfile.following.splice(pos,1);
                        User.findOne({_id: followingId}, (err, followingUser) => {
                            var pos = followingUser.followers.indexOf(req.session.userId);
                            followingUser.followers.splice(pos, 1);
                            followingUser.save(err => {
                                userProfile.save(err => {res.redirect('/user/'+followingId)})
                            })
                        })
                    }
                })
                
                break;

            default:
                break;
        }
    })

module.exports = router;