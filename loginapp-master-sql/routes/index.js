var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');

// Get Homepage

router.get('/',function(req, res){
	res.render('index');
});

module.exports = router;