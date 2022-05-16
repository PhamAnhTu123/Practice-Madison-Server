/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
const moment = require('moment');
const sequelize = require('../../connection');
const Category = require('../../models/Categories');
const Product = require('../../models/Products');
const { cloudinary } = require('../../services/Cloudinary');

module.exports.getAll = async (req, res) => {
  let products;
  products = await Product.findAll({
    include: { model: Category, as: 'category' },
    where: sequelize.literal('products.deletedAt IS NULL'),
  });
  if (req.query.order) {
    if (req.query.order === 'name') {
      products = await Product.findAll({
        order: [
          ['name', 'ASC'],
        ],
        include: { model: Category, as: 'category' },
        where: sequelize.literal('products.deletedAt IS NULL'),
      });
    } else {
      products = await Product.findAll({
        order: [
          ['price', 'DESC'],
        ],
        include: { model: Category, as: 'category' },
        where: sequelize.literal('products.deletedAt IS NULL'),
      });
    }
  }
  if (req.query.category) {
    const filteredProducts = products.filter((product) => product.categoryID == req.query.category);
    return res.status(200).json({ body: filteredProducts });
  }
  res.status(200).json({ body: products });
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

  const products = await Product.findAll({ where: { categoryID: req.body.categoryID } });
  const category = await Category.findByPk(req.body.categoryID);
  await category.update({ productQuantity: products.length });

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
