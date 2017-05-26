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
	login.controll_is_Pilota;
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/close');

//Visualizza Lista Voli attivi dell'utente
curut.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
    var db = require('../lib/db');
    db.query('SELECT * FROM voli WHERE utente = ? AND stato = "1" ',[id_utente_globale], function(err, rows) {
		console.log(rows);
		if (err) throw err;
		res.render('close_fly',{title:"Termina Volo",tutti:rows});
	});
});

//Termina singolo Volo
var curut2 = router.route('/close/:id_list');

curut2.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
    console.log(req.params);
    next();
});

//Prende valori del volo da completare
curut2.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
	var id_list = req.params.id_list;
    var db = require('../lib/db');

    db.query('SELECT voli.*, check_elements.id AS id_check, check_elements.nome AS nome_check FROM voli LEFT JOIN check_elements ON voli.tipo_volo = check_elements.id_list WHERE voli.id = ? AND voli.utente = ? AND voli.stato ="1" AND check_elements.tipo = "1" AND check_elements.stato = "1" ',[id_list,id_utente_globale], function(err, rows) {
    	console.log(rows);
	    res.render('stop_fly',{title:"Concludi Volo",tutti:rows,id_list:id_list});
	});
});

// inserisci ultimi dati del volo e chiudi lo stato, in modo da poter creare il report finale.

curut2.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
    var id_volo = req.params.id_list;
	
	var now = new Date();
	var day=dateFormat(now, "yyyy-mm-dd h:MM:ss");
    var stringObj = JSON.stringify(req.body.datas);

    var data = {
    	post_check:stringObj,
        report:req.body.report,
	    note_post:req.body.note,
	    data_termine:day,
	    stato:'0'
     };
    console.log(data);
    //Aggiornamento volo
	var db = require('../lib/db');
	
    db.query("UPDATE voli set ? WHERE id = ? ",[data,id_volo],function(err, rows){
		if (err) throw err;
        //res.sendStatus(200);
        });
	res.end('done');

});

module.exports = router;