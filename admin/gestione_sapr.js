var express = require('express');
var dateFormat = require('dateformat');

var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

//RESTful route
var router = express.Router();




/*------------------------------------------------------
*  chiamato in causa dall'indirizzo: /admin_sapr
*  e derivati
--------------------------------------------------------*/
router.use(function(req, res, next) {
	var login = require("../controller.js");
	login.controll_is_Admin;
    console.log(req.method, req.url);
    next();
});

var droni = router.route('/sapr');

//Visualizza Lista dei SAPR inseriti

droni.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var db = require('../lib/db');
	db.query('SELECT saprs.*, users.cf FROM `saprs` LEFT JOIN users ON saprs.utente = users.id WHERE users.stato = "1"', function(err, rows, fields) {
		console.log(rows);
		if (err) throw err;
		console.log(rows.length);
		db.query('SELECT * FROM users WHERE id = ? ',[rows.utente], function(err, user, fields1) {
			console.log(rows.utente);
			if (err) throw err;
			db.query('SELECT * FROM users WHERE livello = "2"; ', function(err, users, fields2) {
				console.log(users);
				if (err) throw err;
				res.render('sapr',{title:"Gestione SAPR",data:rows,utenti:user,tutti:users});
			});
		});
	});
});

//post data to DB | POST
droni.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var user_id = req.params.id;
    console.log(user_id);
    //validation

	var now = new Date();
	var day=dateFormat(now, "yyyy-mm-dd h:MM:ss");
   //get data
    var data = {
        cm:req.body.cm,
        dimensioni:req.body.dimensioni,
        peso:req.body.peso,
        data_revisione:req.body.data_revisione,
        utente:req.body.proprietario,
        data_ult_modifica:day,
        stato:'2'
     };
        console.log(data);
    //inserting into mysql
	var db = require('../lib/db');
        db.query("INSERT INTO saprs set ? ",data, function(err, rows){
			if (err) throw err;
        });
	res.end('done');

});




//now for Single route (GET,PUT)
var droni2 = router.route('/sapr/:id');

/*------------------------------------------------------
Gestione singoli SAPR

------------------------------------------------------*/
droni2.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    console.log("You need to smth about droni2 Route ? Do it here");
    console.log(req.params);
    next();
});

//Prende valori da aggiornare.
droni2.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var user_id = req.params.id;

	var db = require('../lib/db');
	db.query("SELECT * FROM saprs WHERE id = ? ",[user_id],function(err,rows){
		console.log(rows);
		if (err) throw err;
        res.render('edit_sapr',{title:"Modifica SAPR",data:rows});
	});


});

//update data
droni2.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var id = req.params.id;
        console.log(id);


    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        cm:req.body.cm,
        dimensioni:req.body.dimensioni,
        peso:req.body.peso,
        data_revisione:req.body.data_revisione,
        stato:req.body.stato
     };
        console.log(data);
    //inserting into mysql
	var db = require('../lib/db');
        db.query("UPDATE saprs set ? WHERE id = ? ",[data,id], function(err, rows){
			if (err) throw err;
        });
	res.end('done');
});



module.exports = router;