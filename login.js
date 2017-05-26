module.exports = function(req,res) {
	sess = req.session;
	if(sess.email) {
		var db = require('./lib/db');
	setInterval(function () {
    	db.query('SELECT 1');
	}, 5000);
		db.query('SELECT * FROM users WHERE cf = "'+sess.email+'" AND password = "'+sess.pass+'" AND stato = "1" ;', function(err, rows, fields) {
			if (err) throw err;
			console.log(rows.length);
			numRows = rows.length;
			if (numRows > 0){
				global.livello_ut_globale = rows[0].livello;
				global.id_utente_globale = rows[0].id;
				var bar = require('./benvenuto.js');
			    bar(res,rows);

			}else{
				// Credenziali errate
				req.session.destroy(function(err) {
					if(err) {
				    	console.log(err);
					}else{
					    res.redirect('/');
					}
				});
			}
		});

	}else{
    	res.write('<h1>Please login first.</h1>');
    	res.end('<a href="/">Login</a>');
	}
}
