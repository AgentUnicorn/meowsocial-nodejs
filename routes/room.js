var express = require('express');
var router = express.Router();

router.route('/',(req, res) => {
    console.log(req.body)
})

module.exports = router;