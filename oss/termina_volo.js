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

var curut = router.route('/close');

//Visualizza Lista Voli attivi dell'utente
//show the CRUD interface | GET
curut.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Oss(res);
    var db = require('../lib/db');
    db.query('SELECT * FROM voli WHERE osservatore = ? AND note_oss IS NULL ',id_utente_globale, function(err, rows) {
		console.log(rows);
		if (err) throw err;
		res.render('close_fly_oss',{title:"Aggiungi Note al Volo",tutti:rows});
	});
});



//Termina singolo Volo
var curut2 = router.route('/close/:id_list');

/*------------------------------------------------------

------------------------------------------------------*/
curut2.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Oss(res);
    console.log("Termina singolo volo");
    console.log(req.params);
    next();
});

//Prende valori da aggiornare.
curut2.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Oss(res);
	var id_list = req.params.id_list;
    var db = require('../lib/db');
    
    db.query('SELECT voli.* FROM voli WHERE voli.id = ? AND voli.osservatore = ? AND note_oss IS NULL ',[id_list,id_utente_globale], function(err, rows) {
    	console.log(rows);
	    res.render('stop_fly_oss',{title:"Concludi Volo",tutti:rows,id_list:id_list});
	});
});

//update data

curut2.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Oss(res);
    var id_volo = req.params.id_list;
	
	var now = new Date();
	var day=dateFormat(now, "yyyy-mm-dd h:MM:ss");

    var data = {
    	note_oss:req.body.note_oss,
    	coordinate_oss:req.body.coordinate,
    	inizio_oss:req.body.inizioVolo,
    	fine_oss:req.body.fineVolo,
    	data_note_oss:day
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