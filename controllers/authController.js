const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const cookie= require('cookie')
const saltrounds = 8;
exports.signUp = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    //Check if required fields are present
    if (!fullName || !email || !password || !role) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields." });
    }

    //Create a new user instance of the schema
    const user = new User({
      fullName: fullName,
      email: email,
      role: role,
      //hash the user password make it unreadable
      password: bcrypt.hashSync(password, saltrounds),
    });

    // Save the user to the database
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    //1.find the user in the database

    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      return res.status(404).send({
        message: "User Not found.",
      });
    }
    //2.check the password of the user request if  its the same with the one in the database
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    //3.if password not valid send the response
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    //4.if it is valid asign the user an access token
    const userId = {
      id: user._id,
    };
    const accessToken = jwt.sign(userId, process.env.ACCESS_TOKEN, {
      expiresIn: 86400, // 24 hours
    });
    const refreshToken=jwt.sign(userId,process.env.REFRESH_TOKEN,{
      expiresIn:'7d'
    })
    //5.put the refresh token in the database
    user.refreshToken=refreshToken
    
    res.cookie('refreshToken',refreshToken,{
      httpOnly:true,
      path:'/refreshToken'
    })
    
    //6.send the user detail with access token a
    res.status(200).send({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      message: "login successful", //string
      accessToken: accessToken,
      
     
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error.message,
    });
  }
};
exports.logOut=(_req,res)=>{
  res.clearCookies('refreshToken')
}
exports.refreshToken=(req,res)=>{
const accessToken=req.cookies.refreshToken


}