const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data}
}

const bcrypt = require('bcrypt')

//Imports for JWT
const jwt=require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async(req,res) =>{
    const {user,pwd} = req.body
    if(!user || !pwd) return res.status(400).json({'message': 'Username and/or password are required'})

    const foundUser = usersDB.users.find(u => u.username === user)
    if(!foundUser) return res.status(401).json({'error': 'User does not exist'}) //Unauthorized
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match){
        //create JWTs
        const accessToken = jwt.sign(
                {"username": foundUser.username},
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
        const otherUsers = usersDB.users.filter(u=> u.username !== foundUser.username) 
        const currentUser = {...foundUser, refreshToken}
        console.log(currentUser)
        usersDB.setUsers([...otherUsers, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model','users.json'),
            JSON.stringify(usersDB.users)
        )  
        //Enviando Refresh Token
        //Max age cookie = 1 dia
        res.cookie('jwt',refreshToken,{httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
        
        //Enviando Access Token
        //Normal Token and refresh token
        //talvez passar o userId aqui tbm para relacionamentos de tabelas
        res.json({accessToken})
    }else{
        res.status(401).json({'error': 'Incorrect Password'})
    }
}

module.exports = {handleLogin}