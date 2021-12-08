var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var User = require('../models/user.js');
var Comment = require('../models/comment.js');
const {
    createPost
} = require('../controller/postCtrl')

// router.route('*')
//     .get((req, res, next) => {
//         req.locals.userId = req.session.userId;
//         next();
//     })

// Create post route 
router.route('/create')
    .post(createPost)

// Update post route
router.route('/update')
.post((req, res) => {
    Post.findOne({_id: req.body.postId},
        (err, post) => {
            if(!req.files || Object.keys(req.files).length === 0) {
                post.postContent = req.body.postContent
                return post.save(err => {res.redirect('/')})
            }
            
            let image = req.files.postImage;
        
            // tạo đường dẫn đến thư mục lưu hình ảnh
            let image_URL = 'public/images/' + image.name;

            // lưu hình ảnh vào thư mục trong db 
            image.mv(image_URL, function(err) {
                if(err)
                    return res.status(500).send(err);
                
                post.postContent = req.body.postContent,
                post.postImages =  image.name
                post.save(err => {
                    res.redirect('/');
                })
            })
        })
})

// Delete post route
router.route('/delete/:id')
    .get((req, res) => {
        Post.deleteOne({
            _id: req.params.id
        }, (err) => {
            res.redirect('/')
        })
    })

router.route('/like/:id')
    .get((req, res) => {
        Post.findOne({_id: req.params.id}, (err, post) => {
            post.likes.push(req.session.userId);
            post.save(err => {
                res.redirect('/');
            })
        })
    })

router.route('/dislike/:id')
    .get((req, res) => {
        Post.findOne({_id: req.params.id}, (err, post) => {
            var pos = post.likes.indexOf(req.session.userId);
            post.likes.splice(pos, 1);
            post.save(err => {
                res.redirect('/');
            })
        })
    })

module.exports = router;