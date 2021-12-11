var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
const {
    getMessages
} = require('../controller/messageCtrl')

router.route('/')
    .get(getMessages)

module.exports = router