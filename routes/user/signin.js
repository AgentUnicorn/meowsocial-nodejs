var express = require('express');
var router = express.Router();
const {loginWithEmail} = require('../../controller/authCtrl');

//localhost:8080/signin

router.route('/')
    .post(loginWithEmail);

module.exports = router;