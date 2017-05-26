var express = require('express');
var dateFormat = require('dateformat');
var expressValidator = require('express-validator');
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

var curut = router.route('/user');

//Visualizza Lista utenti
//show the CRUD interface | GET
curut.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var db = require('../lib/db');
	db.query('SELECT * FROM users ', function(err, rows, fields) {
		console.log(rows);
		if (err) throw err;
		console.log(rows.length);
		res.render('user',{title:"Gestione Utenti",data:rows});

	});
});

//post data to DB | POST
curut.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var user_id = req.params.id;
    console.log(user_id);
    //validazione su nome utente e password
    req.assert('nome','Name is required').notEmpty();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }
	var now = new Date();
	var day=dateFormat(now, "yyyy-mm-dd h:MM:ss");
   //get data
    var data = {
        cf:req.body.cf,
        nome:req.body.nome,
        cognome:req.body.cognome,
        data:req.body.data,
        password:req.body.password,
        livello:req.body.livello,
        data_inserimento:day,
        ultima_modifica:day,
        stato:'1'
     };
        console.log(data);
    //inserting into mysql
	var db = require('../lib/db');
        db.query("INSERT INTO users set ? ",data, function(err, rows){
			if (err) throw err;
        	//res.sendStatus(200);
        });
	res.end('done');

});

var curut2 = router.route('/user/:id');

curut2.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

//Prende valori da aggiornare.
curut2.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var user_id = req.params.id;

	var db = require('../lib/db');
	db.query("SELECT * FROM users WHERE id = ? ",[user_id],function(err,rows){
		console.log(rows);
		if (err) throw err;
        //if user not found
        if(rows.length < 1)
            return res.send("User Not found");
        res.render('edit',{title:"Modifica Utente",data:rows});
	});
});

//update data
curut2.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var user_id = req.params.id;
        console.log(user_id);

    //validation
    req.assert('nome','Name is required').notEmpty();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }
	var now = new Date();
	var day=dateFormat(now, "yyyy-mm-dd h:MM:ss");
    //get data
    var data = {
        cf:req.body.cf,
        nome:req.body.nome,
        cognome:req.body.cognome,
        data:req.body.data,
        password:req.body.password,
        livello:req.body.livello,
        ultima_modifica:day,
        stato:req.body.stato
     };
        console.log(data);
    //inserting into mysql
	var db = require('../lib/db');
        db.query("UPDATE users set ? WHERE id = ? ",[data,user_id], function(err, rows){
			if (err) throw err;
        });
	res.end('done');
});

//delete data
// non cancelliamo gli utenti, ma cambiamo lo stato da attivo (1) a disattivato (0)

module.exports = router;