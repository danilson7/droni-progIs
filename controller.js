
var exports = module.exports = {}
exports.controll_utenteloggatto = function(res) {
  if(id_utente_globale == 0){
      res.redirect('/');
  }
};

exports.controll_is_Admin = function(res) {
  if(livello_ut_globale != 1){
      res.redirect('/');
  }
};
exports.controll_is_Pilota = function(res) {
  if(livello_ut_globale != 2){
      res.redirect('/');
  }
};

exports.controll_is_Oss = function(res) {
  if(livello_ut_globale != 3){
      res.redirect('/');
  }
};