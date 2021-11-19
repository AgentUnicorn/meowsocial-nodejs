var express = require('express');
const { locals } = require('../../app.js');
var router = express.Router();
var User = require('../../models/user.js');
var Post = require('../../models/post.js')

// Get userid from session into locals
router.route('*')
    .get((req, res, next) => {
        res.locals.userId = req.session.userId;
        next();
    })

// Get user profile route 
router.route('/:id')
    .get((req, res) => {
        var id = req.params.id;
        User.findOne({_id: id}, (err, userProfile) => {
            //populate để tham chiếu từ collections post qua user
            Post.find({postAuthor: id})
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
                    res.render('profile.ejs', {userProfile, data});
            })
        })
    })

// Update user info route 
router.route('/update')
    .post((req, res) => {
        var id = req.body.userId;
        var updateUsername = req.body.usernameUpdate;
        User.findOne({_id: id}, (err, userProfile) => {

            if(!req.files || Object.keys(req.files).length === 0) {
                userProfile.username = updateUsername;
                return userProfile.save(err => {
                    //redirect về trang profile + id của user 
                    res.redirect('/user/'+id);
                })
            }

            let image = req.files.useravatarUpdate;
            
            // tạo đường dẫn đến thư mục lưu hình ảnh
            let image_URL = 'public/images/' + image.name;

            // lưu hình ảnh vào thư mục trong db 
            image.mv(image_URL, function(err) {
                if(err)
                    return res.status(500).send(err);
                
                userProfile.username = updateUsername;
                userProfile.avatar = image.name;

                return user.save(err => {
                    //redirect về trang profile + id của user 
                    res.redirect('/user/'+id);
                })
            })

        })
    })

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