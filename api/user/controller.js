/* eslint-disable no-console */
/* eslint-disable consistent-return */
const moment = require('moment');
const User = require('../../models/Users');
const sequelize = require('../../connection');
const BcryptUtils = require('../../services/Bcrypt');
const { generateRandStr } = require('../../services/GenerateRandom');
const Jwt = require('../../services/JWT');
const Mailer = require('../../services/Mailer');
const { cloudinary } = require('../../services/Cloudinary');
const { tokenExtract } = require('../../services/TokenExtract');
const Cart = require('../../models/Cart');
const Product = require('../../models/Products');
const AuthToken = require('../../models/AuthToken');
const ERROR = require('../../constants/errors');
const { userStatus, authStatus } = require('../../constants/comon');
const SUCCESS = require('../../constants/success');

const bcrypt = new BcryptUtils();
const jwt = new Jwt();
const mailer = new Mailer();

module.exports.wellcome = (req, res) => {
  res.render('test.ejs');
};

module.exports.loginTemplate = (req, res) => {
  res.render('login.ejs');
};

module.exports.dashboard = async (req, res) => {
  const users = await User.findAll({ where: sequelize.literal('users.deletedAt IS NULL AND users.role NOT LIKE "admin"') });
  res.render('dashboard.ejs', { users });
};

module.exports.getCart = async (req, res) => {
  const tokenDecoded = tokenExtract(req);

  const user = await User.findByPk(tokenDecoded.id);
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  const cartItems = await Cart.findAll({ where: { userID: tokenDecoded.id }, include: { model: Product, as: 'product' } });

  res.status(200).json({ body: cartItems });
};

module.exports.addToCart = async (req, res) => {
  const { productID, quantity } = req.body;
  const tokenDecoded = tokenExtract(req);

  const user = await User.findByPk(tokenDecoded.id);
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  const cart = await Cart.create({ productID, quantity, userID: tokenDecoded.id });

  res.status(200).json({ body: cart });
};

module.exports.updateCart = async (req, res) => {
  const { productID, quantity } = req.body;
  const tokenDecoded = tokenExtract(req);

  const user = await User.findByPk(tokenDecoded.id);
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  const cart = await Cart.findOne({ userID: tokenDecoded.id, productID });

  if (quantity === 0) {
    await cart.destroy();
  }

  await cart.update({ quantity });

  res.status(200).json({ body: cart });
};

module.exports.testMultiplepart = async (req, res) => {
  try {
    const response = await cloudinary.uploader.upload(`public/${req.file.originalname}`, { folder: 'upload', upload_preset: 'ml_default' });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
  res.render('test.ejs');
};

module.exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const checkExist = await User.findOne({ where: { email } });
  if (checkExist) {
    return res.status(400).send({ messase: ERROR.EMAIL_EXIST });
  }
  const hashedPass = await bcrypt.hash(password);

  const user = await User.create({ username, email, password: hashedPass });

  const code = generateRandStr(6, 'mix');

  await User.update({ verify: code, verifyExpire: moment().add(3, 'minutes') }, { where: { email } });

  const mail = mailer.message('phamanhtu12112000@gmail.com', user.email, 'Wellcome home babe', `Your verify code here ${code}`);
  mailer.sendMail(mail);

  res.status(200).json({ body: user });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  if (user.status === userStatus.pending) {
    return res.status(400).send({ message: ERROR.USER_NEED_TO_VERIFY_FIRST });
  }

  if (user.status === userStatus.blocked) {
    return res.status(400).send({ message: ERROR.USER_BLOCKED });
  }

  const comparePass = await bcrypt.compare(password, user.getDataValue('password'));

  if (!comparePass) {
    return res.status(400).send({ message: ERROR.WRONG_PASSWORD });
  }

  res.json({ body: { user, token: jwt.issue({ id: user.id, scope: user.role }) } });
};

module.exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).send({ message: ERROR.ADMIN_DOES_NOT_EXIST });
  }

  const comparePass = await bcrypt.compare(password, user.getDataValue('password'));

  if (!comparePass) {
    return res.status(400).send({ message: ERROR.WRONG_PASSWORD });
  }

  req.session.isAuth = true;

  res.redirect('/dashboard');
};

module.exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw err;
    }
  });
  res.redirect('/admin/login');
};

module.exports.verify = async (req, res) => {
  const { code, email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).send({ message: ERROR.WRONG_PASSWORD });
  }

  if (user.verify !== code) {
    return res.status(400).send({ message: ERROR.WRONG_VERIFY_CODE });
  }

  if (moment() > user.verifyExpire) {
    return res.status(400).send({ message: ERROR.VERIFY_CODE_EXPIRED });
  }

  await User.update({
    verify: null,
    verifyExpire: null,
    status: userStatus.active,
  }, { where: { email } });

  res.status(200).json({ body: { user, token: jwt.issue({ id: user.id, scope: user.role }) } });
};

module.exports.resendVerify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  const code = generateRandStr(6, 'mix');

  await User.update({ verify: code, verifyExpire: moment().add(3, 'minutes') }, { where: { email } });

  const mail = mailer.message('phamanhtu12112000@gmail.com', user.email, 'Wellcome home babe', `Your verify code here ${code}`);
  mailer.sendMail(mail);

  res.status(200).json({ message: SUCCESS.SUCCESS });
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  const token = jwt.issue({
    email: user.email,
    expire: moment().add(3, 'minutes'),
  });

  const authTokens = await AuthToken.findAll({ where: { email } });

  if (authTokens.length > 0) {
    await AuthToken.update({ status: authStatus.disable }, { where: { email } });
    await AuthToken.create({
      email,
      token,
      status: authStatus.available,
    });
  } else {
    await AuthToken.create({
      email,
      token,
      status: authStatus.available,
    });
  }

  const mail = mailer.message(
    'phamanhtu12112000@gmail.com',
    user.email,

    'Your recover code here',

    `Your reset password link here http://localhost:8080/auth/${token}`,
  );
  mailer.sendMail(mail);

  res.status(200).json({ message: SUCCESS.SUCCESS });
};

module.exports.authTokenTemplate = async (req, res) => {
  const { token } = req.params;
  const auth = await AuthToken.findOne({ where: { token } });
  if (auth.status === authStatus.disable) {
    return res.status(400).send(ERROR.CAN_NOT_USE_THIS_LINK_ANYMORE);
  }

  const currentToken = jwt.verify(token);
  if (moment() > moment(currentToken.expire)) {
    return res.status(400).send(ERROR.CAN_NOT_USE_THIS_LINK_ANYMORE);
  }

  res.render('AuthToken.ejs', { email: currentToken.email, token });
};

module.exports.verifyAuthToken = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const auth = await AuthToken.findOne({ where: { token } });
  if (auth.status === authStatus.disable) {
    return res.status(400).send(ERROR.CAN_NOT_USE_THIS_LINK_ANYMORE);
  }

  const currentToken = jwt.verify(token);
  if (moment() > moment(currentToken.expire)) {
    return res.status(400).send(ERROR.CAN_NOT_USE_THIS_LINK_ANYMORE);
  }

  const newPassword = await bcrypt.hash(password);
  await User.update({ password: newPassword }, { where: { email: currentToken.email } });
  await AuthToken.update({ status: 'disable' }, { where: { token } });
  res.status(200).send(SUCCESS.CHANGE_PASSWORD_SUCCEED);
};

module.exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  if (user.passCode !== code) {
    return res.status(400).send({ message: ERROR.WRONG_VERIFY_CODE });
  }

  if (moment() > user.passCodeExpire) {
    return res.status(400).send({ message: ERROR.VERIFY_CODE_EXPIRED });
  }

  const password = await bcrypt.hash(newPassword);

  await user.update({ password, passCode: null, passCodeExpire: null });

  res.json({ body: { user, token: jwt.issue({ id: user.id, scope: user.role }) } });
};

module.exports.changePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  const tokenDecoded = tokenExtract(req);

  const user = await User.findByPk(tokenDecoded.id);
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return res.status(400).send({ message: ERROR.WRONG_PASSWORD });
  }

  const newHashedPassword = await bcrypt.hash(newPassword);

  await user.update({ password: newHashedPassword });

  res.status(200).json({ body: user, message: SUCCESS.SUCCESS });
};

module.exports.getMe = async (req, res) => {
  const tokenDecoded = tokenExtract(req);

  const user = await User.findByPk(tokenDecoded.id, { include: { model: Cart, as: 'cart' } });
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  res.status(200).json({ body: { user } });
};

module.exports.updateMe = async (req, res) => {
  const tokenDecoded = tokenExtract(req);

  const user = await User.findByPk(tokenDecoded.id);
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  if (req.file) {
    const response = await cloudinary.uploader.upload(
      `public/${req.file.originalname}`,
      { folder: 'upload', upload_preset: 'ml_default' },
    );
    req.body.avatar = response.url;
  }

  user.update(req.body);

  res.json({ body: { user } });
};

module.exports.getOne = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  res.render('user.ejs', { user });
};

module.exports.deletedOne = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  user.update({ deletedAt: moment() });

  res.redirect('/dashboard');
};

module.exports.blockOne = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  if (req.body.status) {
    user.update({ status: userStatus.blocked });
  } else {
    user.update({ status: userStatus.active });
  }

  res.render('user.ejs', { user });
};
