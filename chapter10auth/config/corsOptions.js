const whitelist = [
'https://www.yoursite.com'
,'http://127.0.0.1:5500'
,'http://localhost:3500']

const corsOptions = {
    origin: (origin, callback) => {
        //se o index da origem existir (!=1) então passa callback
        //sem erros e está permitida
        //!origin é para permitir que o undefined de dev seja permitido
        if(whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus:200
}

module.exports = corsOptions