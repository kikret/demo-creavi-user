const mongoose = require('mongoose')            
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({            
    name: {                                     
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
    tokens: [{                                  
        token: {                                
            type: String,                       
            required: true                      
        }
    }],
    rol:{
        value: { type: String, default: 6 },
        user: { type: String, default: "Owner User" },
        permissions: { type: Array, default: [1, 1, 0] }
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
    const user = this
    const data = {
        _id: user._id,
        rol: user.rol,
        email: user.email
    }
    const token = jwt.sign(data, global.gConfig.secret_key)        
    user.tokens = user.tokens.concat({token})                       
    await user.save()                                               
    return token                                                    
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
