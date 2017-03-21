var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var User = require('../models/user');
var Job = require('../models/job');
var datetime = require('../models/datenow');

// Get User Dashboard

router.get('/control', ensureAuthenticatedUser, function(req, res){
	var userid = req.user.id;
  Job.getJobsByUserId(userid,function(err,row){
    if(err) throw err;
    //console.log(row);
		res.render('user',{username:req.user.name,row});
  });
});

function ensureAuthenticatedUser(req, res, next){
	if(req.isAuthenticated() && (req.user.status==='MEMBER')){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

router.post('/edit', function(req, res){
    var editjobid = req.body.editjobid;
    console.log("Edit Job = "+editjobid);
});
router.post('/delete', function(req, res){
    var deletejobid = req.body.deletejobid;
    console.log("Delete Job = "+deletejobid);
});
router.post('/runjob', function(req, res){
    var runjobid = req.body.runjobid;
    console.log("Run Job = "+runjobid);
});

router.post('/upload', function(req, res){
  var jobname = req.query.jobname;
  var compress = req.query.compress;
  var filename = req.query.filename;
	var userid = req.user.id;
  var upPath = './uploads/upload-'+userid+'-'+jobname+'-'+datetime.getDateTime();
  var upDir = path.join(__base, upPath);
  var newJob = new Job({
			jobname: jobname,
			status:'uploaded',
			userid: userid,
			compress: compress,
			filepath: upDir,
      filename: filename
	});
  //console.log(newJob.userid+'\n'+newJob.jobname+'\n'+newJob.compress+'\n'+newJob.status+'\n'+newJob.filename+'\n'+newJob.filepath)
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
  form.parse(req, function(err, fields, files) 
  {
    //console.log(newJob);
  });
  Job.createJob(newJob,function(err,res){
    if(err) throw err;
		console.log(res);
  });
});
module.exports = router;

