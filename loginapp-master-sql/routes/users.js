var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password,
			status: 'MEMBER',
		});
		
		User.userExist(newUser,function(err,isExist){
			if(isExist){
				req.flash('error_msg', 'User Already Exist');
				res.redirect('/users/register');
			}
			else{
				User.createUser(newUser,function(err,res){
					if(err) throw err;
					console.log(res);
				});
				req.flash('success_msg', 'Your Registration is Success');
				res.redirect('/users/login');
			} 
		});		
	}
});


router.post('/login',
  passport.authenticate('local', {successRedirect:'/user/control', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/user/control');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;