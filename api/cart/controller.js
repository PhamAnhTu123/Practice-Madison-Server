/* eslint-disable no-console */
/* eslint-disable consistent-return */
const User = require('../../models/Users');
const { tokenExtract } = require('../../services/TokenExtract');
const Cart = require('../../models/Cart');
const Product = require('../../models/Products');
const ProductImages = require('../../models/ProductImages');
const ERROR = require('../../constants/errors');
const { mediaStatus } = require('../../constants/comon');

module.exports.getCart = async (req, res) => {
  const tokenDecoded = tokenExtract(req);

  const user = await User.findByPk(tokenDecoded.id);
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  const cartItems = await Cart.findAll({
    where: { userID: tokenDecoded.id },
    include: { model: Product, include: { model: ProductImages, as: 'images', where: { status: mediaStatus.default } }, as: 'product' },
  });

  res.status(200).json({ body: cartItems });
};

module.exports.addToCart = async (req, res) => {
  const { productID, quantity } = req.body;
  const tokenDecoded = tokenExtract(req);

  const user = await User.findByPk(tokenDecoded.id);
  if (!user) {
    return res.status(400).send({ message: ERROR.USER_DOES_NOT_EXIST });
  }

  const product = await Product.findByPk(productID);

  if (quantity > product.storage) {
    return res.status(400).send({ message: ERROR.OUT_OF_STORAGE });
  }

  const cartItem = await Cart.findOne({ where: { userID: tokenDecoded.id, productID } });

  if (cartItem) {
    await cartItem.update({ quantity: cartItem.quantity + quantity });
    return res.status(200).json({ body: cartItem });
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

  const product = await Product.findByPk(productID);

  if (quantity > product.storage) {
    return res.status(400).send({ message: ERROR.OUT_OF_STORAGE });
  }

  const cart = await Cart.findOne({ where: { userID: tokenDecoded.id, productID } });

  if (!cart) {
    return res.status(400).send({ message: ERROR.CART_ITEM_DOES_NOT_EXIST });
  }

  if (quantity === 0) {
    await cart.destroy();
  }

  await cart.update({ quantity });

  res.status(200).json({ body: cart });
};
