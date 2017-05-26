var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : '81.31.153.77',
	port     : '3306',
	user     : 'crawlermot_dr',	
	password : 'aTpEK96X',
	database : 'crawlermot_dr'
});
connection.on('error', error =>  console.log(error));

connection.connect(function(err) {
	if (err) {
    	console.error('error connecting: ' + err.stack);
	    return;
  	}
	console.log('connected as id ' + connection.threadId);

});

module.exports = connection;

