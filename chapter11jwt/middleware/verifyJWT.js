require('dotenv')
const jwt = require('jsonwebtoken')

const verifyJWT = (req,res, next) => {
    const authHeader = req.headers['authorization']
    if(!authHeader) return res.status(401).json({'error': 'User not authorized'})
    console.log(authHeader) // Bearer TOKEN
    const token = authHeader.split(' ')[1] // getting the token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.status(403).json({'err': 'Forbidden. Invalid Token'}) //Invalid Token
            req.user = decoded.username
            next()
        }
        )
}

module.exports = verifyJWT