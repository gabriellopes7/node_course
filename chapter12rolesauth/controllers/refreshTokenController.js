const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data}
}

//Imports for JWT
const jwt=require('jsonwebtoken')
require('dotenv').config()

const handleRefreshToken = (req,res) =>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(401).json({'error': 'Unauthorized'})
    const refreshToken = cookies.jwt

    const foundUser = usersDB.users.find(u => u.refreshToken === refreshToken)

    if(!foundUser) return res.status(403).json({'error': 'Forbidden'}) //Unauthorized

    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) =>{
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403); //Forbidden
            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                        }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '60s'}
            )
            res.json({accessToken})
        }
    )
       
}

module.exports = {handleRefreshToken}