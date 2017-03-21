var SchemaObject = require('schema-object');
var connection  = require('express-myconnection');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var mysql_query = require('../main');

// User Schema
var UserSchema = new SchemaObject({
	username: {
		type: String
	},
	password: {
		type: String,
		bcrypt: true
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	status: {
		type: String
	}
});

var User = module.exports = UserSchema;

module.exports.adminExist = function(callback){
	var query ='SELECT * FROM users WHERE status = "ADMIN"';
	var isExist = false;
	mysql_query(query,function(err,res){
		if (err) callback(err);
		else {
            if (res.length>0){
                isExist = true;
            }
            callback(null,isExist);
        }
	});
}
module.exports.userExist = function(newUser,callback){
	var query ='SELECT username FROM users WHERE username = ?';
	var isExist = false;
	mysql_query(query,[newUser.username],function(err,res){
		if (err) callback(err);
		else {
			if (res[0]) isExist = true; 
			callback(null,isExist);
		};
	});
}

module.exports.createUser = function(newUser,callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        mysql_query('INSERT INTO users ( username, pass, email, name, status) ' +
        	'VALUES ( ?, ? , ?, ?, ?);', [newUser.username, newUser.password, newUser.email,newUser.name,newUser.status],
        	function(err,res) {
				if (err) callback(err);
				else callback(null,res);
        	});
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	mysql_query("SELECT * FROM users WHERE username = ?", [username],
        function(err, res) {
            if (err) callback(err);
            else callback(null, res);
        });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
