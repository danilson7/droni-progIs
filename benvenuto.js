//Messaggio di benvenuto dopo il Login
module.exports = function(res, rows) {
    expressValidator = require('express-validator');
    var express = require('express');
    var app = express();

    if (rows[0].livello == '1') {
        console.log('Benvenuto Amministratore');
        res.render('admin.html');
    }
    if (rows[0].livello == '2') {
        res.render('pilota.html');
        console.log('Benvenuto Pilota');
    }
    if (rows[0].livello == '3') {
        res.render('osservatore.html');
        console.log('Benvenuto Osservatore');
    }
}
