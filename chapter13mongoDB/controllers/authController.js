
const User = require('../model/User')
const bcrypt = require('bcrypt')

//Imports for JWT
const jwt=require('jsonwebtoken')

const handleLogin = async(req,res) =>{
    const {user,pwd} = req.body
    if(!user || !pwd) return res.status(400).json({'message': 'Username and/or password are required'})

    const foundUser = await User.findOne({username: user}).exec()
    if(!foundUser) return res.status(401).json({'error': 'User does not exist'}) //Unauthorized
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match){
        const roles = Object.values(foundUser.roles)
        //create JWTs
        const accessToken = jwt.sign(
                {
                    "UserInfo":
                        {
                            "username": foundUser.username,  
                            "roles": roles
                        }
                },
                process.env.ACCESS_TOKEN_SECRET,
                //melhor 5min ou 15min
                {expiresIn: '60s'}
        )
        const refreshToken = jwt.sign(
                {"username": foundUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                //melhor 5min ou 15min
                {expiresIn: '1d'}
        )
        //Saving refreshToken with current User
        //Salvando refreshToken no banco de dados para o usuário
        //gerar um novo AccessToken
        
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(result)
        
        //Enviando Refresh Token
        //Max age cookie = 1 dia
        res.cookie('jwt',refreshToken,{httpOnly: true, sameSite: 'None', maxAge: 24*60*60*1000}) //secure: true
        
        //Enviando Access Token
        //Normal Token and refresh token
        //talvez passar o userId aqui tbm para relacionamentos de tabelas
        res.json({accessToken})
    }else{
        res.status(401).json({'error': 'Incorrect Password'})
    }
}

module.exports = {handleLogin}