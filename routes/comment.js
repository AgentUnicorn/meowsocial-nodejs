var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var Comment = require('../models/comment.js');

// Create comment route 
router.route('/create')
    .post((req, res) => {
        return Post.findOne({_id: req.body.postid}, (err, post)=> {

            var cmt = new Comment({
                cmtAuthor: req.session.userId,
                cmtText: req.body.usercomment,
            })
            post.comments.push(cmt._id);
            post.save(err => {
                cmt.save(err => {res.redirect('/')});
            })
            
        })
    })

// Update comment route 
router.route('/update')
    .post((req, res) => {
        Comment.findOne({_id: req.body.cmtid}, (err, cmt) => {
            cmt.cmtText = req.body.updatecomment;
            cmt.save(err => {
                res.redirect('/');
            })
        })
    })

// Delete comment route 
router.route('/delete/:id')
    .get((req, res) => {
        Comment.deleteOne({
            _id: req.params.id
        }, (err) => {
            res.redirect('/')
        })
    })



module.exports = router;