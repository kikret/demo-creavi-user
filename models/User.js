const mongoose = require('mongoose')            
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwt_decode = require("jwt-decode")

const userSchema = mongoose.Schema({            
    nickname: {                                     
        type: String,                           
        required: true,                         
        trim: true
    },    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {     
                throw new Error({error: 'Dirección de correo inválida'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    isLogged: {                                     
        type: Boolean,
        required: false,
        default: false
    },
    tokens: [{                                  
        token: {                                
            type: String,                       
            required: false                      
        }
    }],
    rol:{
        value: { type: String },
        user: { type: String },
        permissions: { type: {} }
    }
})

userSchema.pre('save', async function (next) {                          
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)         
    }                                                               
    next()                                                          
})

userSchema.methods.generateAuthToken = async function() {    
    
    var user = this
    
    // User data
    var userData = {
        _id: user._id,
        rol: user.rol,
        email: user.email,
        permissions: user.permissions
    }

    

    // SIGNING OPTIONS
    var signOptions = {
        expiresIn: global.keys.expiresIn,
        algorithm: global.keys.algorithm
      };    
    const token = jwt.sign(userData, global.keys.private_key, signOptions)

    user.tokens = user.tokens.concat({token})                       
    await user.save()                                               
    return token                                                    
}

userSchema.statics.refreshAuthToken = async function(token) {
    var decoded = jwt_decode(token); // jwt_decode(result.value, { header: true });  import!      
    let { email, _id } = decoded;

    const isValidToken = jwt.verify(token, global.keys.public_key)
    const user = await User.findOne({ email } )
    
    if ( (!user || !isValidToken) && (user._id == _id) ) {
        throw new Error({ error: 'Credenciales de login inválidas' })       
    }

    let tokens = user.tokens;
    //let deleteToken = [token]
    // User data
    var userData = {
        _id: user._id,
        rol: user.rol,
        email: user.email
    }

    // SIGNING OPTIONS
    var signOptions = {
        expiresIn: global.keys.expiresIn,
        algorithm: global.keys.algorithm
      };    
    const refreshToken =  jwt.sign(userData, global.keys.private_key, signOptions)    
    // delete older token
    // tokens = tokens.filter( item => !deleteToken.includes(item) );
    tokens = tokens.filter((value)=>value.token!=token);
    //user.tokens = tokens;
    // add new token
    tokens = tokens.concat({_id:_id, token:refreshToken})
    user.tokens = tokens    
    await user.save()                                               
    return refreshToken                                                
}

userSchema.statics.logout = async function(token) {
    var decoded = jwt_decode(token); 
    let { email, _id } = decoded;

    const isValidToken = jwt.verify(token, global.keys.public_key)
    const user = await User.findOne({ email } )
    
    if ( (!user || !isValidToken) && (user._id == _id) ) {
        throw new Error({ error: 'Credenciales de login inválidas' })       
    }

    let tokens = user.tokens;    
    
    tokens = tokens.filter((value)=>value.token!=token);    
    user.tokens = tokens    
    await user.save()                                               
    return true                                                
}

userSchema.statics.logoutAll = async function(token) {
    var decoded = jwt_decode(token); 
    let { email, _id } = decoded;

    const isValidToken = jwt.verify(token, global.keys.public_key)
    const user = await User.findOne({ email } )
    
    if ( (!user || !isValidToken) && (user._id == _id) ) {
        throw new Error({ error: 'Credenciales de login inválidas' })       
    }

    let tokens = user.tokens;    
    
    //tokens = tokens.filter((value)=>value.token!=token);    

    user.tokens = [];    
    await user.save()                                               
    return true                                                
}


userSchema.statics.findByCredentials = async (email, uPassword) => {      
    const user = await User.findOne({ email } )               
    if (!user) {                                                            
        throw new Error({ error: 'Credenciales de login inválidas' })       
    }
    const isPasswordMatch = await bcrypt.compare(uPassword, user.password)   
    if (!isPasswordMatch) {                             
        throw new Error({ error: 'Credenciales de login inválidas' })
    }    
    
    return user
}

const User = mongoose.model('User', userSchema)                             

module.exports = User                                                       

/**
 * Temporal permissions
 * Permiso	Valor Octal user	        Descripción
 *  r – –	4	        External User   solo permiso de lectura
 *  r w –	6	        Owner User      permisos de lectura y escritura
 *  r – x	5	        Lite Admin      permisos de lectura y ejecución
 *  r w x	7	        Super User      todos los permisos establecidos, lectura, escritura y ejecución
 */

 /**
  var payload = {
      idUsuario: idUsuario
    };
    // PRIVATE and PUBLIC key
    var privateKEY = fs.readFileSync(__dirname + "/private.key", "utf8");
    var publicKEY = fs.readFileSync(__dirname + "/public.key", "utf8");

    // SIGNING OPTIONS
    var signOptions = {
      expiresIn: "1200h",
      algorithm: "RS256"
    };
    var token = jwt.sign(payload, privateKEY, signOptions);
    io.emit("user/auth", { token: token });
    res.status(200).send({ status: { message: "Auth sended!" } });

  */