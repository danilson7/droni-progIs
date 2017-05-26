var express = require('express');
var dateFormat = require('dateformat');

var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

//RESTful route
var router = express.Router();




/*------------------------------------------------------
*  Entreremo in questa sezione dal seguente url
*   /admin_checklist e simili
*  del tipo /admin_checklist/check_list , /admin_checklist/check_list/7
*  
--------------------------------------------------------*/
router.use(function(req, res, next) {
	var login = require("../controller.js");
	login.controll_is_Admin;
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/check_list');

//Visualizza Lista delle checklist inserite

curut.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var db = require('../lib/db');
	db.query('SELECT * FROM check_list ', function(err, rows, fields) {
		console.log(rows);
		if (err) throw err;
		res.render('check_list',{title:"Gestione Check List",data:rows});
	});
});

//Inserimento nuova Checklist
curut.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var user_id = req.params.id;
    console.log(user_id);
    //validation

	var now = new Date();
	var day=dateFormat(now, "yyyy-mm-dd h:MM:ss");
   //get data
    var data = {
        nome:req.body.nome,
        data_creazione:day,
        stato:'1'
     };
        console.log(data);
    //inserting into mysql
	var db = require('../lib/db');
        db.query("INSERT INTO check_list set ? ",data, function(err, rows){
			if (err) throw err;
        });
	res.end('done');
});




//Gestione delle Checklist, UPDATE
var curut2 = router.route('/checklist/:id');

curut2.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    console.log(req.params);
    next();
});


//Prende valori da aggiornare della checklist
curut2.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var list_id = req.params.id;

	var db = require('../lib/db');
	db.query("SELECT * FROM check_list WHERE id = ? ",[list_id],function(err,rows){
		console.log(rows);
		if (err) throw err;
        res.render('edit_checklist',{title:"Modifica Checklist",data:rows});
	});


});

//update Checklist
curut2.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var id = req.params.id;

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        nome:req.body.nome,
        stato:req.body.stato
     };
        console.log(data);
    //inserting into mysql
	var db = require('../lib/db');
        db.query("UPDATE check_list set ? WHERE id = ? ",[data,id], function(err, rows){
			if (err) throw err;
        	//res.sendStatus(200);
        });
	res.end('done');
});


//Gestione Check-element nelle checklist.
var curut3 = router.route('/checkelements/:id');

/*------------------------------------------------------
Ogni checklist avrà dei check element PRE e POST volo!

------------------------------------------------------*/
curut3.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    console.log("Sezione checkelements");
    console.log(req.params);
    next();
});

//Prende valori da aggiornare.
curut3.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var checklist_id = req.params.id;

	var db = require('../lib/db');
	db.query("SELECT * FROM check_elements WHERE id_list = ? AND tipo = '0';",[checklist_id],function(err,pre){
		if (err) throw err;
		db.query("SELECT * FROM check_elements WHERE id_list = ? AND tipo = '1';",[checklist_id],function(err,post){
			if (err) throw err;
        	res.render('check_elements',{title:"Gestione Check Elements",pre:pre,post:post,id:checklist_id});
		});
	});


});
//Inserimento checkelement
curut3.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var id_list = req.params.id;
    //validation

	var now = new Date();
	var day=dateFormat(now, "yyyy-mm-dd h:MM:ss");
   //get data
    var data = {
        nome:req.body.nome,
        tipo:req.body.tipo,
        data_creazione:day,
        id_list:id_list
     };
    //inserting into mysql
	var db = require('../lib/db');
        db.query("INSERT INTO check_elements set ? ",data, function(err, rows){
			if (err) throw err;
        	//res.sendStatus(200);
        });
	res.end('done');

});
//update checkelement

var curut4 = router.route('/checkelement/:id');
curut4.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    console.log(req.params);
    next();
});


//Prende valori da aggiornare della checklist
curut4.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var list_id = req.params.id;

	var db = require('../lib/db');
	db.query("SELECT * FROM check_elements WHERE id = ? ",[list_id],function(err,rows){
		console.log(rows);
		if (err) throw err;
        res.render('edit_check_elements',{title:"Modifica Check-element",data:rows});
	});


});

//update Checkelement
curut4.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var id = req.params.id;

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }
    var data = {
        nome:req.body.nome,
        stato:req.body.stato
     };
        console.log(data);
    //inserting into mysql
	var db = require('../lib/db');
        db.query("UPDATE check_elements set ? WHERE id = ? ",[data,id], function(err, rows){
			if (err) throw err;
        	//res.sendStatus(200);
        });
	res.end('done');
});

module.exports = router;