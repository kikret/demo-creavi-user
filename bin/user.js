const auth = require("../middleware/auth");
const jwt = require('jsonwebtoken')
const User = require("../models/User");

const setUsers = (body) => new Promise( async (resolve, reject)=>{
  try {
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();    
    resolve({ value: { user, token } });    
  } catch (err) {
    reject(err);    
  }
});

const login = (body) => new Promise( async (resolve, reject)=>{  
  try {
    const { email, password } = body;    
    const user = await User.findByCredentials(email, password);        
    const token = await user.generateAuthToken();
    resolve({ value: token });
  } catch (err) {
    reject(err);
  }
});

const logout = (body) => new Promise( (resolve, reject)=>{
  //const token = req.header('Authorization').replace('Bearer ', '')                
  //const data = jwt.verify(token, process.env.JWT_KEY)                             
  /*try {
      const user = await User.findOne({ _id: data._id, 'tokens.token': token })   
      if (!user) {
          throw new Error()
      }
      req.user = user                                                             
      req.token = token                                                           
      next()                                                                      
  } catch (error) {
      res.status(401).send({ error: 'No está autorizado para acceder a este recurso' })
  }*/
});

const logoutall = (body) => new Promise( (resolve, reject)=>{

});

  
const updateUser = (body)  => new Promise( (resolve, reject)=>{

});

const deleteUser = (body)  => new Promise( (resolve, reject)=>{

});

module.exports = {
  setUsers,
  login,
  logout,
  logoutall,
  updateUser,
  deleteUser,
};



/*const login = async (body) => {
  try {
    const { email, password } = body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

const logout = async (user) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const logoutall = async (user) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    return { status: true };
  } catch (error) {
    {
      status: false, error;
    }
  }
};*/
