const allowedOrigins = require('./allowedOrigins')


const corsOptions = {
    origin: (origin, callback) => {
        //se o index da origem existir (!=1) então passa callback
        //sem erros e está permitida
        //!origin é para permitir que o undefined de dev seja permitido
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus:200
}

module.exports = corsOptions