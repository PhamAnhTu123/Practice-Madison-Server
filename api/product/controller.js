/* eslint-disable consistent-return */
const moment = require('moment');
const sequelize = require('../../connection');
const Category = require('../../models/Categories');
const Product = require('../../models/Products');
const { cloudinary } = require('../../services/Cloudinary');

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

module.exports.getAllForAdmin = async (req, res) => {
  const products = await Product.findAll({
    order: [
      ['name', 'ASC'],
      ['price', 'DESC'],
    ],
    include: { model: Category, as: 'category' },
    where: sequelize.literal('products.deletedAt IS NULL'),
  });

  res.render('product.ejs', { products });
};

module.exports.createProduct = async (req, res) => {
  const categories = await Category.findAll();
  res.render('productCreate.ejs', { categories });
};

module.exports.getOneForAdmin = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: { model: Category, as: 'category' } });
  if (!product) {
    return res.status(400).send({ message: 'Product does not exist' });
  }

  res.render('productDetail.ejs', { product });
};

module.exports.getOne = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: { model: Category, as: 'category' } });
  if (!product) {
    return res.status(400).send({ message: 'Product does not exist' });
  }

  res.status(200).json({ body: product });
};

module.exports.createOne = async (req, res) => {
  const response = await cloudinary.uploader.upload(`public/${req.file.originalname}`, { folder: 'upload', upload_preset: 'ml_default' });
  req.body.thumbnail = response.url;

  const product = await Product.create(req.body);

  res.redirect(`/products/${product.id}`);
};

module.exports.updateOne = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(400).send({ message: 'Product does not exist' });
  }

  if (req.file) {
    const response = await cloudinary.uploader.upload(`public/${req.file.originalname}`, { folder: 'upload', upload_preset: 'ml_default' });
    req.body.thumbnail = response.url;
  }

  product.update(req.body);

  res.redirect(`/products/${id}`);
};

module.exports.deletedOne = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(400).send({ message: 'Product does not exist' });
  }

  product.update({ deletedAt: moment() });

  res.redirect('/products');
};
