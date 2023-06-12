// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
const User = require('../model/User')
// const fsPromises = require("fs").promises;
// const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  //check for duplicate usernames in db
  // const duplicate = usersDB.users.find((u) => u.username === user);
  //Para achar o usuario no banco de dados
  const duplicate = await User.findOne({username: user}).exec();

  if (duplicate)
    return res.status(409).json({ message: "This username already exists" }); //Conflict
  try {
    //encrypt password
    const hashedPassword = await bcrypt.hash(pwd, 10);

    //Create and store the new user in mongo
    const result = await User.create({
      "username": user,
      //Nao precisa passar o role pq já tem um valor padrão
      // "roles": {
      //   "User": 2001,
      // },
      "password": hashedPassword,        
    });
    //Outro métodos
    // const newUser = new User();
    // newUser.username = user
    // newUser.password = hashedPassword
    // const result = await newUser.save()
    // const newUser = new User({
    //   "username": user,
    //   "password": hashedPassword,
    // });
    // await newUser.save()
    
    console.log(result)
    // usersDB.setUsers([...usersDB.users, newUser]);
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(usersDB.users)
    // );
    // console.log(usersDB.users);

    //Create and Store new user in Mongo
    res.status(201).json({ Success: `New user ${user} created !` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
