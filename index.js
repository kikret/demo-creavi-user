const {
    postUsers, 
    login, 
    logoutall,
    updateUser, 
    deleteUser } = require('./bin/user')

//require('./db/db')                              

const version = function(){ 
  console.log('1.0.0');
};

const help = function(){
  console.log('Esta es la ayuda')
}

module.exports = { 
  version, 
  help 
}

