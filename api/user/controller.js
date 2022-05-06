const User = require("../../models/Users");
const BcryptUtils = require('../../services/Bcrypt');
const Jwt = require('../../services/JWT');

const bcrypt = new BcryptUtils;
const jwt = new Jwt;

module.exports.wellcome = (req, res) => {
  res.json({ body: 'Hello World' });
} 

module.exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const checkExist = await User.findOne({ where: { email: email } });
  if (checkExist) {
    console.log(checkExist);
    res.status(400).send({ messase: 'Email Exist' });
  }
  const hashedPass = await bcrypt.hash(password);
  console.log(hashedPass);
  const user = await User.create({ username, email, password: hashedPass });
  res.status(200).json({ body: user });
}

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });

  if (!user) { 
    return res.status(400).send({ message: 'User does not exist' });
  }

  const comparePass = await bcrypt.compare( password , user.getDataValue('password'));

  if (!comparePass) {
    return res.status(400).send({ message: 'Wrong password' });
  }

  res.json({ body: { user, token: jwt.issue({ id: user.id, scope: user.role }) } });
}