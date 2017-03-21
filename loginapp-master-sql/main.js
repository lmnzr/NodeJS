var mysql = require('mysql');

var sqlConnection = function sqlConnection(sql, values, next) {

    // It means that the values hasnt been passed
    if (arguments.length === 2) {
        next = values;
        values = null;
    }

    var connection = mysql.createConnection({
    connectionLimit : 10, //important
    host: "localhost",
    user: "root",
    password: "azuresky102",
    database: "wavivcl_sql"
    });
    connection.connect(function(err) {
        if (err !== null) {
            console.log("[MYSQL] Error connecting to mysql:" + err+'\n');
        }
    });
    
    connection.query(sql, values, function(err) {
        if (err) throw err;
        connection.end(); // close the connection
        // Execute the callback
        next.apply(this, arguments);
    });
}

module.exports = sqlConnection;

