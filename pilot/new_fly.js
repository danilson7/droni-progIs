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

var curut = router.route('/new');

//Visualizza Lista Checklist attive

curut.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
    var db = require('../lib/db');
    db.query('SELECT * FROM check_list WHERE stato = "1";', function(err, rows) {
		console.log(rows);
		if (err) throw err;
		console.log(rows.length);
		id_checklist = '0';
		res.render('new_fly',{title:"Crea Nuovo Volo",tutti:rows,id_checklist:id_checklist});
	});
});


curut.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);

	res.end('done');

});




//now for Single route (GET,DELETE,PUT)
var curut2 = router.route('/new_step/:id_list');


curut2.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
    console.log("new_step_nuovo volo");
    console.log(req.params);
    next();
});

// in base al tipo di volo scelto mostra i check-elements da compilare
curut2.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
	var id_list = req.params.id_list;
    var db = require('../lib/db');
    db.query('SELECT * FROM check_elements WHERE id_list = ? AND tipo = "0" AND stato ="1" ',[id_list], function(err, rows) {
		console.log(rows);
		if (err) throw err;
		console.log(rows.length);
		db.query('SELECT * FROM users WHERE livello = 3 AND stato ="1" ', function(err, rowss) {
			db.query('SELECT * FROM saprs WHERE utente = ? AND stato ="2" ',[id_utente_globale], function(err, rows_sapr) {
				res.render('new_fly_step',{title:"Crea Nuovo Volo Step 2",tutti:rows,id_list:id_list,osservatori:rowss,sapr:rows_sapr});
			});
		});
	});
});

//Inserisce nel db le check-list pre-volo
curut2.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
    var tipo_volo = req.params.id_list;
    var user = id_utente_globale;
    
	var now = new Date();
	var day=dateFormat(now, "yyyy-mm-dd h:MM:ss");

    
	if(req.body.data_volo < day){
		res.end('Errore');
	}else{

    //get data
    var stringObj = JSON.stringify(req.body.datas);
    var stringObjSap = JSON.stringify(req.body.datasap);
    var data = {
        utente:user,
        tipo_volo:tipo_volo,
        pre_check:stringObj,
        datasap:stringObjSap,
        note_pre:req.body.note,
        osservatore:req.body.osservatore,
        data_volo:req.body.data_volo,
        data_creazione:day,
        coordinate:req.body.coordinate
        //stato:1
     };
	//Stato 1 perchè il volo è creato ed è attivo, da terminare !!
    //inserting into mysql
    console.log(data);
	var db = require('../lib/db');
    db.query("INSERT INTO voli set ? ",data, function(err, rows){

		if (err) throw err;

        });
	res.end('done');
	}
});


//now for Single route (GET,DELETE,PUT)
var curut3 = router.route('/volo_creato');

curut3.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
    console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

curut3.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
	var id_list = req.params.id_list;
    var db = require('../lib/db');
    	res.render('volo_creato',{title:"Volo creato"});

});


module.exports = router;