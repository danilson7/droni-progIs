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
	login.controll_is_Oss;
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/visualizza');

//Visualizza Lista voli
curut.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Oss(res);
    var db = require('../lib/db');
    db.query('SELECT * FROM voli WHERE osservatore = ? AND note_oss IS NOT NULL ORDER BY data_volo DESC ',id_utente_globale, function(err, rows) {
		console.log(rows);
		if (err) throw err;
		res.render('history',{title:"Storico Voli",tutti:rows});
	});
});

var curut2 = router.route('/visualizza/:id_list');

curut2.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Oss(res);
    next();
});

curut2.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Oss(res);
	var id_list = req.params.id_list;
    var db = require('../lib/db');
    db.query('SELECT voli.*, users.nome, users.cognome FROM voli LEFT JOIN users ON voli.utente = users.id WHERE voli.osservatore = ? AND voli.note_oss IS NOT NULL AND voli.id = ? LIMIT 0,1 ',[id_utente_globale,id_list], function(err, rows) {
		console.log(rows);
		if (err) throw err;
		console.log(rows.length);
			res.render('history_oss',{title:"Visualizza Report Volo",tutti:rows,id_list:id_list});
	});
});


module.exports = router;