const mongoose = require('mongoose')            

mongoose.connect(global.gConfig.database, {
    useNewUrlParser: true,                      
    useCreateIndex: true, 
    useUnifiedTopology: true                       
})