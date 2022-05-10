/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
const moment = require('moment');

const OrderItem = require('../../models/OrderItem');
const Order = require('../../models/Orders');
const Product = require('../../models/Products');
const { tokenExtract } = require('../../services/TokenExtract');

module.exports.getAll = async (req, res) => {
  const tokenDecoded = tokenExtract(req);
  if (tokenDecoded.scope !== 'admin') {
    return res.status(403).send({ message: 'You do not have permission to access' });
  }

  const orders = await Order.findAll({ include: { model: OrderItem, as: 'items' } });

  res.status(200).json({ body: orders });
};

module.exports.getAllUserOrder = async (req, res) => {
  const tokenDecoded = tokenExtract(req);

  const orders = await Order.findAll({ where: { userID: tokenDecoded.id }, include: { model: OrderItem, as: 'items' } });

  res.status(200).json({ body: orders });
};

module.exports.createOrder = async (req, res) => {
  const { items } = req.body;
  const tokenDecoded = tokenExtract(req);

  const order = await Order.create({ userID: tokenDecoded.id, createdAt: moment() });

  let paycheck = 0;

  for (const item of items) {
    const product = await Product.findByPk(item.productID);
    if (!product) {
      return res.status(400).send({ message: 'Product doesnt exist' });
    }

    paycheck += product.price * item.quantity;

    await OrderItem.create({ orderID: order.id, productID: item.productID, quantity: item.quantity });
  }
  await order.update({ paycheck });

  const newOrder = await Order.findByPk(order.id, { include: { model: OrderItem, include: { model: Product, as: 'product' }, as: 'items' } });

  res.status(200).json({ body: newOrder });
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
