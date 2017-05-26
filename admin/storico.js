var express = require('express');
var dateFormat = require('dateformat');

var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//RESTful route
var router = express.Router();

router.use(function(req, res, next) {
	var login = require("../controller.js");
	login.controll_is_Admin;
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/storico');

//Visualizza Lista dei voli già terminati.
curut.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var db = require('../lib/db');
    db.query('SELECT * FROM voli WHERE stato = 0 ORDER BY data_volo DESC ', function(err, rows) {
		console.log(rows);
		if (err) throw err;
		console.log(rows.length);
		res.render('history',{title:"Storico Voli",tutti:rows});
	});
});


curut.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
	res.end('done');
});


var curut2 = router.route('/storico/:id_list');

curut2.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    next();
});

//Prende valori per mostrare il Report di volo.
curut2.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
	var id_list = req.params.id_list;
    var db = require('../lib/db');
    db.query('SELECT voli.*, users.nome, users.cognome, pilota.nome AS pilota_n, pilota.cognome AS pilota_c FROM voli LEFT JOIN users ON voli.osservatore = users.id LEFT JOIN users as pilota ON voli.utente = pilota.id WHERE voli.stato = 0 AND voli.id = ? ORDER BY data_volo DESC ',[id_list], function(err, rows) {
		console.log(rows);
		if (err) throw err;
		db.query("SELECT check_elements.nome, check_elements.tipo FROM voli, check_elements WHERE voli.pre_check LIKE CONCAT('%',check_elements.id,'%') AND voli.id = ? GROUP BY check_elements.nome UNION SELECT check_elements.nome, check_elements.tipo FROM voli, check_elements WHERE voli.post_check LIKE CONCAT('%',check_elements.id,'%') AND voli.id = ? GROUP BY check_elements.nome UNION SELECT saprs.cm, saprs.stato FROM voli, saprs  WHERE voli.datasap LIKE CONCAT('%',saprs.id,'%') AND voli.id = ? GROUP BY saprs.cm",[id_list,id_list,id_list], function(err, rowss) {
			if (err) throw err;
			res.render('dettagli',{title:"Visualizza Report Volo",tutti:rows,id_list:id_list,check:rowss});
		});
	});
});

module.exports = router;
