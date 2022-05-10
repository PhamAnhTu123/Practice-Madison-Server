/* eslint-disable consistent-return */
const moment = require('moment');
const sequelize = require('../../connection');
const Category = require('../../models/Categories');
const Product = require('../../models/Products');
const { tokenExtract } = require('../../services/TokenExtract');

module.exports.getAll = async (req, res) => {
  const categories = await Product.findAll({
    order: [
      ['name', 'ASC'],
      ['price', 'DESC'],
    ],
    include: { model: Category, as: 'category' },
    where: sequelize.literal('products.deletedAt IS NULL'),
  });

  res.status(200).json({ body: categories });
};

module.exports.getOne = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: { model: Category, as: 'category' } });
  if (!product) {
    return res.status(400).send({ message: 'Product does not exist' });
  }

  res.status(200).json({ body: product });
};

module.exports.createOne = async (req, res) => {
  const tokenDecoded = tokenExtract(req);

  if (tokenDecoded.scope !== 'admin') {
    return res.status(401).send({ message: 'You do not have the access permission' });
  }

  const product = await Product.create(req.body);

  res.status(200).json({ body: product });
};

module.exports.updateOne = async (req, res) => {
  const { id } = req.params;

  const tokenDecoded = tokenExtract(req);

  if (tokenDecoded.scope !== 'admin') {
    return res.status(401).send({ message: 'You do not have the access permission' });
  }

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(400).send({ message: 'Product does not exist' });
  }

  product.update(req.body);

  res.status(200).json({ body: product });
};

module.exports.deletedOne = async (req, res) => {
  const { id } = req.params;

  const tokenDecoded = tokenExtract(req);

  if (tokenDecoded.scope !== 'admin') {
    return res.status(401).send({ message: 'You do not have the access permission' });
  }

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(400).send({ message: 'Product does not exist' });
  }

  product.update({ deletedAt: moment() });

  res.status(200).json({ body: product });
};
