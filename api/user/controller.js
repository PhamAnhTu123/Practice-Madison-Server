const moment = require('moment');
const User = require("../../models/Users");
const BcryptUtils = require('../../services/Bcrypt');
const { generateRandStr } = require("../../services/GenerateRandom");
const Jwt = require('../../services/JWT');
const Mailer = require('../../services/Mailer');

const bcrypt = new BcryptUtils;
const jwt = new Jwt;
const mailer = new Mailer;

module.exports.wellcome = (req, res) => {
  const random = generateRandStr(6, 'mix');

  res.json({ body: random });
} 

module.exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const checkExist = await User.findOne({ where: { email: email } });
  if (checkExist) {
    return res.status(400).send({ messase: 'Email Exist' });
  }
  const hashedPass = await bcrypt.hash(password);

  const user = await User.create({ username, email, password: hashedPass });

  const code = generateRandStr(6, 'mix');

  await User.update({ verify: code, verifyExpire: moment().add(3, 'minutes') }, { where: { email } });

  const mail = mailer.message('phamanhtu12112000@gmail.com', user.email, 'Wellcome home babe', `Your verify code here ${code}`);
  mailer.sendMail(mail);

  res.status(200).json({ body: user });
}

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });

  if (!user) { 
    return res.status(400).send({ message: 'User does not exist' });
  }

  if (user.status === 'pending') {
    return res.status(400).send({ message: 'User need to verify email first' });
  }

  const comparePass = await bcrypt.compare( password , user.getDataValue('password'));

  if (!comparePass) {
    return res.status(400).send({ message: 'Wrong password' });
  }

  res.json({ body: { user, token: jwt.issue({ id: user.id, scope: user.role }) } });
}