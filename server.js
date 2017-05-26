var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var app = express();
expressValidator = require('express-validator');
var mysql = require('mysql');
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);
app.use(session({
    secret: 'ssshhhhh'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator());

var sess;

global.id_utente_globale = 0;
global.livello_ut_globale = 0;


app.get('/', function(req, res) {
    sess = req.session;
    global.req;
    global.res;
    var now = new Date();
    var day = dateFormat(now, "yyyy-mm-dd h:MM:ss");
    console.log(day);
    if (sess.email) {
        res.redirect('/admin');
    } else {
        res.render('index.html');
    }
});

app.post('/login', function(req, res) {
    sess = req.session;
    sess.email = req.body.email;
    sess.pass = req.body.pass;
    res.end('done');
});

app.get('/admin', function(req, res) {
    var baro = require('./login.js');
    baro(req, res);
});
//Gestione del logout: distrugge sessione setta id_utente_globale a 0
app.get('/logout', function(req, res) {

    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            global.livello_ut_globale = 0;
            res.redirect('/');
        }
    });
});
/*------------------------------------------------------
*
*  Sezione dedicata all'amministrazione.
*  Gestione Utenti
*  Gestione SAPR
*  Gestione Dispositivi Ausiliari
*  Gestione check-list
*
--------------------------------------------------------*/

//Gestione Utenti

var admin_page = require('./admin/gestione_utenti');
app.use('/admin', admin_page);

//Gestione SAPR
var admin_sapr_page = require('./admin/gestione_sapr');
app.use('/admin_sapr', admin_sapr_page);

//Gestione Dispositivi Ausiliari
var admin_dispositivi_ausiliari = require('./admin/dispositivi_ausiliari');
app.use('/admin_dispositivi', admin_dispositivi_ausiliari);

//Gestione Check-list
var admin_checklist_page = require('./admin/gestione_checklist');
app.use('/admin_checklist', admin_checklist_page);

//visualizza voli
var admin_voli = require('./admin/storico');
app.use('/admin_storico', admin_voli);


/*------------------------------------------------------
*
*  Sezione dedicata al pilota.
*  Gestione Voli
*  Visualizza Voli
*  Termina Volo
*
--------------------------------------------------------*/

var new_fly = require('./pilot/new_fly');
app.use('/pilota', new_fly);

//Termina volo pilota
var end_fly = require('./pilot/termina_volo');
app.use('/pilota_fly', end_fly);

var history_fly = require('./pilot/history_fly');
app.use('/pilota_storico', history_fly);

/*------------------------------------------------------
*
*  Sezione dedicata all'Osservatore.
*  Visualizza Voli
*  Aggiungi note
*
--------------------------------------------------------*/

var oss_end_fly = require('./oss/termina_volo');
app.use('/osservatore_fly', oss_end_fly);

var oss_history_fly = require('./oss/history_fly');
app.use('/osservatore_storico', oss_history_fly);
/*------------------------------------------------------
*
*  Avvio del server. Porta 3000
*
--------------------------------------------------------*/
app.listen(3000, function(){
  console.log("ciao");
});
