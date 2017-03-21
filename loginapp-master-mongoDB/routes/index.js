var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');

// Get Homepage

router.get('/',function(req, res){
	res.render('index');
});

router.get('/member', ensureAuthenticatedMember, function(req, res){
    //console.log(req.user);
	res.render('member',{username:req.user.name});
});

router.get('/admin', ensureAuthenticatedAdmin, function(req, res){
    //console.log(req.user);
	res.render('admin',{username:req.user.name});
});

function ensureAuthenticatedMember(req, res, next){
	if(req.isAuthenticated() && req.user.stat==='member'){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

function ensureAuthenticatedAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.stat==='admin'){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/member');
	}
}


router.post('/upload', function(req, res){
  var upPath = './uploads'
  if (!fs.existsSync(upPath)){
    fs.mkdirSync(upPath);
    console.log('Path Added');
  }

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__base, upPath);

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

module.exports = router;