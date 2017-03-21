var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');

// Get Admin Dashboard

router.get('/control', ensureAuthenticatedAdmin, function(req, res){
	res.render('admin',{username:req.user.name});
});

function ensureAuthenticatedAdmin(req, res, next){
	if(req.isAuthenticated() && (req.user.status==='ADMIN')){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/wvadmin/login');
	}
}

module.exports = router;