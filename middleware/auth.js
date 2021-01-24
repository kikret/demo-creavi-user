const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async(req, res, next) => {
    if(req.header('Authorization')!==undefined){
        const token = req.header('Authorization').replace('Bearer ', '')
        try {
            const data = jwt.verify(token, global.keys.public_key)
            const user = await User.findOne({ _id: data._id, 'tokens.token': token })   
            if (!user) {
                throw new Error()
            }
            req.user = user                                                             
            req.token = token                                                           
            next()                                                                      
        } catch (error) {
            res.status(401).send({ error: 'No está autorizado para acceder a este recurso' })
        }
    } else {
        res.status(401).send({ error: 'No se ha enviado una autorizacion' })
    }
}
module.exports = auth