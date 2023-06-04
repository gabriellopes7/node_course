const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data}
}

const bcrypt = require('bcrypt')

const handleLogin = async(req,res) =>{
    const {user,pwd} = req.body
    if(!user || !pwd) return res.status(400).json({'message': 'Username and/or password are required'})

    const foundUser = usersDB.users.find(u => u.username === user)
    if(!foundUser) return res.status(401).json({'error': 'User does not exist'}) //Unauthorized
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match){
        //create JWTs
        //Normal Token and refresh token
        res.json({'success': `User ${user} is logged in`})
    }else{
        res.status(401).json({'error': 'Incorrect Password'})
    }
}

module.exports = {handleLogin}