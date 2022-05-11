/* eslint-disable consistent-return */
const moment = require('moment');
const sequelize = require('../../connection');
const Category = require('../../models/Categories');
const Product = require('../../models/Products');
const { tokenExtract } = require('../../services/TokenExtract');
const { cloudinary } = require('../../services/Cloudinary');

module.exports.getAll = async (req, res) => {
  const categories = await Category.findAll({
    order: [
      ['name', 'ASC'],
      ['productQuantity', 'DESC'],
    ],
    include: [{ model: Product, as: 'products', where: sequelize.literal('products.deletedAt IS NULL') }],
    where: sequelize.literal('categories.deletedAt IS NULL'),
  });
  res.status(200).json({ body: categories });
};

module.exports.getOne = async (req, res) => {
  const category = await Category.findByPk(req.params.id, { include: { model: Product, as: 'products' } });
  if (!category) {
    return res.status(400).send({ message: 'Category does not exist' });
  }

  res.status(200).json({ body: category });
};

module.exports.createOne = async (req, res) => {
  const tokenDecoded = tokenExtract(req);

  if (tokenDecoded.scope !== 'admin') {
    return res.status(401).send({ message: 'You do not have the access permission' });
  }

  const response = await cloudinary.uploader.upload(`public/${req.file.originalname}`, { folder: 'upload', upload_preset: 'ml_default' });
  req.body.thumbnail = response.url;

  const category = await Category.create(req.body);

  res.status(200).json({ body: category });
};

module.exports.updateOne = async (req, res) => {
  const { id } = req.params;

  const tokenDecoded = tokenExtract(req);

  if (tokenDecoded.scope !== 'admin') {
    return res.status(401).send({ message: 'You do not have the access permission' });
  }

  if (req.file) {
    const response = await cloudinary.uploader.upload(`public/${req.file.originalname}`, { folder: 'upload', upload_preset: 'ml_default' });
    req.body.thumbnail = response.url;
  }

  const category = await Category.findByPk(id);
  if (!category) {
    return res.status(400).send({ message: 'Product does not exist' });
  }

  category.update(req.body);

  res.status(200).json({ body: category });
};

module.exports.deletedOne = async (req, res) => {
  const { id } = req.params;

  const tokenDecoded = tokenExtract(req);

  if (tokenDecoded.scope !== 'admin') {
    return res.status(401).send({ message: 'You do not have the access permission' });
  }

  const category = await Category.findByPk(id);
  if (!category) {
    return res.status(400).send({ message: 'Category does not exist' });
  }

  category.update({ deletedAt: moment() });

  res.status(200).json({ body: category });
};
