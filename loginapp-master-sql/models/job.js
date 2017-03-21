var SchemaObject = require('schema-object');
var connection  = require('express-myconnection');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var mysql_query = require('../main');

var JobSchema = new SchemaObject({
	jobid: {
		type: Number
	},
	jobname: {
		type: String
	},
	status: {
		type: String
	},
	userid: {
		type: Number
	},
	compress: {
		type: Number
	},
	filename: {
		type: String
	},
	filepath: {
		type: String
	}
});

var Job = module.exports = JobSchema;

module.exports.createJob = function(newJob,callback){
	mysql_query('INSERT INTO Jobs (User_Id, Job_Name, Job_Compress, Job_Status, Job_FileName, Job_FilePath) ' +
    'VALUES (? , ?, ?, ?, ?, ?);', [newJob.userid, newJob.jobname, newJob.compress, newJob.status, newJob.filename, newJob.filepath],
    function(err,res) {
		if (err) callback(err);
		else callback(null,res);
    });
}

module.exports.updateJob = function(newJob, callback){	
	mysql_query("UPDATE Jobs SET Job_Name = ?, Job_Compress = ?, Job_Status = ?, Job_FileName = ?, Job_FilePath = ? WHERE Job_Id = ?;", 
	[newJob.jobname, newJob.compress, newJob.status, newJob.filename, newJob.filepath, newJob.jobid],
        function(err, res) {
            if (err) callback(err);
            else callback(null, res);
        });
}

module.exports.deleteJob = function(jobid, callback){	
	mysql_query("DELETE FROM Jobs WHERE Job_Id = ? ;", [jobid],
        function(err, res) {
            if (err) callback(err);
            else callback(null, res);
        });
}

module.exports.getJobsByUserId = function(userid, callback){
	mysql_query("SELECT * FROM Jobs WHERE User_Id = ? ORDER BY Job_Date DESC", [userid],
        function(err, res) {
            if (err) callback(err);
            else 
			{
				for (var i = 0, len = res.length; i < len; i++) {
					var datetime = res[i].Job_Date+"";
					var date = datetime.slice(4, 15);
					res[i].Job_ShortDate = date;
				};
				callback(null, res);
			}
        });
}

module.exports.getJobByJobId = function(jobid, callback){
	mysql_query("SELECT * FROM Jobs WHERE Job_Id = ?", [jobid],
        function(err, res) {
            if (err) callback(err);
            else callback(null, res);
        });
}

module.exports.updateJobStatus = function(jobid, callback){	
	mysql_query("UPDATE Jobs SET Job_Status='Done' WHERE Job_Id = ?;", [jobid],
        function(err, res) {
            if (err) callback(err);
            else callback(null, res);
        });
}