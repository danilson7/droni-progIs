var express = require('express');
var dateFormat = require('dateformat');

var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

//RESTful route
var router = express.Router();




/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /amministra and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
	var login = require("../controller.js");
	login.controll_is_Pilota;
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/visualizza');

//Visualizza Lista utenti
//show the CRUD interface | GET
curut.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
    var db = require('../lib/db');
    db.query('SELECT * FROM voli WHERE utente = ? AND stato = 0 ORDER BY data_volo DESC ',id_utente_globale, function(err, rows) {
		console.log(rows);
		if (err) throw err;
		console.log(rows.length);

		res.render('history',{title:"Storico Voli",tutti:rows});
	});
});

//post data to DB | POST
curut.post(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);

	res.end('done');

});




//now for Single route (GET,DELETE,PUT)
var curut2 = router.route('/visualizza/:id_list');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:user_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
curut2.all(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
    console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

//Prende valori da aggiornare.
curut2.get(function(req,res,next){
	var login = require("../controller.js");
	login.controll_is_Pilota(res);
	var id_list = req.params.id_list;
    var db = require('../lib/db');
    db.query('SELECT voli.*, users.nome, users.cognome FROM voli LEFT JOIN users ON voli.osservatore = users.id WHERE voli.utente = ? AND voli.stato = 0 AND voli.id = ? ORDER BY data_volo DESC ',[id_utente_globale,id_list], function(err, rows) {
		console.log(rows);
		if (err) throw err;
		console.log(rows.length);
		db.query("SELECT check_elements.nome, check_elements.tipo FROM voli, check_elements WHERE voli.pre_check LIKE CONCAT('%',check_elements.id,'%') AND voli.id = ? GROUP BY check_elements.nome UNION SELECT check_elements.nome, check_elements.tipo FROM voli, check_elements WHERE voli.post_check LIKE CONCAT('%',check_elements.id,'%') AND voli.id = ? GROUP BY check_elements.nome UNION SELECT saprs.cm, saprs.stato FROM voli, saprs  WHERE voli.datasap LIKE CONCAT('%',saprs.id,'%') AND voli.id = ? GROUP BY saprs.cm",[id_list,id_list,id_list], function(err, rowss) {
		
			if (err) throw err;
			res.render('dettagli',{title:"Visualizza Report Volo",tutti:rows,id_list:id_list,check:rowss});
		});
	});
});

//delete data
// non cancelliamo gli utenti, ma cambiamo lo stato da attivo (1) a disattivato (0)

module.exports = router;