const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");

const saltrounds = 8;
exports.signUp = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    //Check if required fields are present
    if (!body.fullName || !body.email || !body.password || !body.role) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields." });
    }

    //Create a new user instance
    const user = new User({
      fullName: body.fullName,
      email: body.email,
      role: body.role,
      password: bcrypt.hashSync(body.password, saltrounds),
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
  try {
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res.status(404).send({
        message: "User Not found.",
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
const userId={
    id: user._id,
  }
    const token = jwt.sign(
      userId,
      process.env.API_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    res.status(200).send({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      message: "login successful",
      accessToken: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error.message,
    });
  }
};
