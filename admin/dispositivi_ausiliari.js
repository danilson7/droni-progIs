// DEPRECATED !! I dispositivi ausiliari sono gestiti tramite le checklist !

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

var curut = router.route('/ausiliari');



curut.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var db = require('../lib/db');
	db.query('SELECT * FROM attrezzatura ', function(err, rows, fields) {
		console.log(rows);
		if (err) throw err;
		res.render('dispositivi_ausiliari',{title:"Gestione Dispositivi Ausiliari",data:rows});
	});
});

//Inserimento nuovo dispositivo ausiliario
curut.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Admin(res);
    var user_id = req.params.id;
    console.log(user_id);

   //get data
    var data = {
        nome:req.body.nome,
        stato:1
     };
    //inserting into mysql
	var db = require('../lib/db');
        db.query("INSERT INTO attrezzatura set ? ",data, function(err, rows){
			if (err) throw err;
        	//res.sendStatus(200);
        });
	res.end('done');

});


module.exports = router;