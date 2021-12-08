var express = require('express');
var router = express.Router();
const {createUser} = require('../../controller/userCtrl');

//localhost:8080/register

router.route('/')
    .post(createUser);

module.exports = router;