/* eslint-disable no-console */
/* eslint-disable consistent-return */
const User = require('../../models/Users');
const { tokenExtract } = require('../../services/TokenExtract');
const Cart = require('../../models/Cart');
const Product = require('../../models/Products');

module.exports.getCart = async (req, res) => {
  const tokenDecoded = tokenExtract(req);

  const user = await User.findByPk(tokenDecoded.id);
  if (!user) {
    return res.status(400).send({ message: 'User does not exist' });
  }

  const cartItems = await Cart.findAll({ where: { userID: tokenDecoded.id }, include: { model: Product, as: 'product' } });

  res.status(200).json({ body: cartItems });
};

module.exports.addToCart = async (req, res) => {
  const { productID, quantity } = req.body;
  const tokenDecoded = tokenExtract(req);

  const user = await User.findByPk(tokenDecoded.id);
  if (!user) {
    return res.status(400).send({ message: 'User does not exist' });
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
    return res.status(400).send({ message: 'User does not exist' });
  }

  const cart = await Cart.findOne({ where: { userID: tokenDecoded.id, productID } });

  if (!cart) {
    return res.status(400).send({ message: 'Cart item does not exist' });
  }

  if (quantity === 0) {
    await cart.destroy();
  }

  await cart.update({ quantity });

  res.status(200).json({ body: cart });
};
