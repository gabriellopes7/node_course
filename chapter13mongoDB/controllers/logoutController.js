const User = require('../model/User')


const handleLogout = async(req,res) =>{
    //On client, also delete the accessToken

    const cookies = req.cookies

    if(!cookies?.jwt) return res.sendStatus(204) //No Content

    const refreshToken = cookies.jwt

    //Is refreshToken in DB
    const foundUser = await User.findOne({refreshToken}).exec()

    if(!foundUser) {
        //No caso de ter o jwt cookie mas nao ter o refreshToken no DB, a gente limpa os cookies
        res.clearCookie('jwt', {httpOnly: true})
        return res.status(204) //Successfull but no content
    }
   
    //Delete the refresh Token in DB
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log(result)
    // const otherUsers = usersDB.users.filter(u=> u.refreshToken !== foundUser.refreshToken)
    // const currentUser = {...foundUser, refreshToken: ''}
    // usersDB.setUsers([...otherUsers, currentUser])
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(usersDB.users)
    // )

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None'}) //secure: true - only serves on https
    res.sendStatus(204)//No content, refreshToken cleared
}

module.exports = {handleLogout}