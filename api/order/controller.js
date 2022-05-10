/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
const moment = require('moment');

const OrderItem = require('../../models/OrderItem');
const Order = require('../../models/Orders');
const Product = require('../../models/Products');
const { tokenExtract } = require('../../services/TokenExtract');

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
