const User = require("../../models/Users");
const BcryptUtils = require('../../services/Bcrypt');

const bcrypt = new BcryptUtils;

module.exports.wellcome = (req, res) => {
  res.json({ body: 'Hello World' });
} 

module.exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const checkExist = await User.findOne({ where: { email: email } });
  if(checkExist) {
    console.log(checkExist);
    res.status(400).send({ messase: 'Email Exist' });
  }
  const hashedPass = await bcrypt.hash(password);
  console.log(hashedPass);
  const user = await User.create({ username, email, password: hashedPass });
  res.status(200).json({ body: user });
}