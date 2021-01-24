const config = require('./bin/conf')
const auth = require('./middleware/auth')

const {
  setUsers,
  login,
  logout,
  logoutAll,
  updateUser,
  deleteUser, 
  refreshToken  
  } = require('./bin/user')

require('./db/db')                              

const version = function(){ 
  return '1.0.0';
};

const help = function(){
  return 'Esta es la ayuda';
}


module.exports = { 
  version, 
  help,
  setUsers,
  login,
  logout,
  logoutAll,
  updateUser,
  deleteUser,
  auth,
  refreshToken
}

