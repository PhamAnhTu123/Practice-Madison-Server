/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
const moment = require('moment');
const Mailer = require('../../services/Mailer');

const mailer = new Mailer();

const OrderItem = require('../../models/OrderItem');
const Order = require('../../models/Orders');
const Product = require('../../models/Products');
const { tokenExtract } = require('../../services/TokenExtract');
const User = require('../../models/Users');
const Cart = require('../../models/Cart');

module.exports.getAll = async (req, res) => {
  const orders = await Order.findAll({ include: [{ model: User, as: 'user' }, { model: OrderItem, as: 'items' }] });

  res.render('order.ejs', { orders });
};

module.exports.getAllUserOrder = async (req, res) => {
  const tokenDecoded = tokenExtract(req);
  const { order } = req.query;

  let orders = await Order.findAll({ where: { userID: tokenDecoded.id }, include: { model: OrderItem, include: { model: Product, as: 'product' }, as: 'items' } });

  if (order === 'price') {
    orders = await Order.findAll({ where: { userID: tokenDecoded.id }, order: [['paycheck', 'DESC']], include: { model: OrderItem, include: { model: Product, as: 'product' }, as: 'items' } });
  }

  if (order === 'date') {
    orders = await Order.findAll({ where: { userID: tokenDecoded.id }, order: [['createdAt', 'DESC']], include: { model: OrderItem, include: { model: Product, as: 'product' }, as: 'items' } });
  }

  res.status(200).json({ body: orders });
};

module.exports.createOrder = async (req, res) => {
  const { items, payment } = req.body;
  const tokenDecoded = tokenExtract(req);

  const order = await Order.create({
    userID: tokenDecoded.id, createdAt: moment(), paymentMethod: payment,
  });

  if (payment === 'visa') {
    await order.update({ paymentDate: moment(), status: 'payment success' });
  }

  let paycheck = 0;

  for (const item of items) {
    const product = await Product.findByPk(item.productID);
    if (!product) {
      return res.status(400).send({ message: 'Product doesnt exist' });
    }

    if (item.quantity > product.storage) {
      await order.destroy();
      return res.status(400).send({ message: 'Out of storage limit' });
    }

    paycheck += product.price * item.quantity;

    await OrderItem.create({ orderID: order.id, productID: item.productID, quantity: item.quantity });
    await product.update({ storage: product.storage - item.quantity });
  }
  await Cart.destroy({ where: { userID: tokenDecoded.id } });
  await order.update({ paycheck });

  const newOrder = await Order.findByPk(order.id, { include: { model: OrderItem, include: { model: Product, as: 'product' }, as: 'items' } });

  res.status(200).json({ body: newOrder });
};

module.exports.submitOrder = async (req, res) => {
  const { type } = req.body;
  const { id } = req.params;

  const tokenDecoded = tokenExtract(req);

  const order = await Order.findOne({ where: { id, userID: tokenDecoded.id }, include: { model: OrderItem, as: 'items' } });

  if (!order) {
    return res(400).send({ message: 'Order does not exit' });
  }

  const user = await User.findByPk(tokenDecoded.id);

  if (type === 'cash') {
    await order.update({ status: 'pending payment' });
    const mail = mailer.message('phamanhtu12112000@gmail.com', user.email, 'Wellcome home babe', 'Your order has been delivering');
    mailer.sendMail(mail);
  } else {
    await order.update({ status: 'payment success' });
    const mail = mailer.message('phamanhtu12112000@gmail.com', user.email, 'Wellcome home babe', 'Your order has been delivering');
    mailer.sendMail(mail);
  }

  res.status(200).json({ body: order });
};

module.exports.getOne = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findByPk(id, { include: [{ model: User, as: 'user' }, { model: OrderItem, include: { model: Product, as: 'product' }, as: 'items' }] });

  res.render('orderDetail.ejs', { order });
};

module.exports.updatePaymentMethod = async (req, res) => {
  const { paymentMethod } = req.body;
  const { id } = req.params;

  const order = await Order.findByPk(id);

  if (paymentMethod === 'visa') {
    order.update({ paymentDate: order.createdAt, status: 'payment success', paymentMethod });
  } else {
    order.update({ paymentDate: moment(), status: 'payment success', paymentMethod });
  }

  res.redirect(`/orders/${id}`);
};

module.exports.editOrder = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  const tokenDecoded = tokenExtract(req);
  let paycheck = 0;

  const order = await Order.findOne({ where: { id, userID: tokenDecoded.id }, include: { model: OrderItem, as: 'items' } });

  if (!order) {
    return res(400).send({ message: 'Order does not exit' });
  }

  const orderItems = order.items;

  for (const item of items) {
    const product = await Product.findByPk(item.productID);
    if (orderItems.some((orderItem) => orderItem.productID === item.productID)) {
      await (await OrderItem.findOne({ where: { orderID: order.id, productID: item.productID } })).update({ quantity: item.quantity });
    } else {
      await OrderItem.create({ orderID: order.id, productID: item.productID, quantity: item.quantity });
    }

    if (item.quantity === 0) {
      await OrderItem.destroy({ where: { productID: item.productID, orderID: order.id } });
    }

    paycheck += product.price * item.quantity;
  }

  await order.update({ paycheck });

  const updatedOrder = await Order.findOne({ where: { id, userID: tokenDecoded.id }, include: { model: OrderItem, as: 'items' } });

  res.status(200).json({ body: updatedOrder });
};
