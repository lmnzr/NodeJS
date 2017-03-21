var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Admin = require('../models/user');

// Register
router.get('/register', function(req, res){
    Admin.adminExist(function(err,isExist){
    if (err) throw err;
    if(!isExist){
        res.render('adminregister');
    }
    else{
        req.flash('error_msg', 'Admin Already Exist');
		res.redirect('/wvadmin/login');
    }
    });
});

// Login
router.get('/login', function(req, res){
	res.render('adminlogin');
});

// Register Admin
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var adminname = req.body.adminname;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('adminname', 'Admin Name is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('adminregister',{
			errors:errors
		});
	} 
    else {
		var newAdmin = new Admin({
			name: name,
			email:email,
			username: adminname,
			password: password,
			status: 'ADMIN',
		});
		Admin.createUser(newAdmin,function(err,res){
			if(err) throw err;
			console.log(res);
		});
        req.flash('success_msg', 'Your Registration is Success');
		res.redirect('/wvadmin/login');	
	}
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/admin/control', failureRedirect:'/wvadmin/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/admin/control');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/wvadmin/login');
});

module.exports = router;