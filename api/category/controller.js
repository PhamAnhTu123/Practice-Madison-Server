/* eslint-disable consistent-return */
const moment = require('moment');
const sequelize = require('../../connection');
const Category = require('../../models/Categories');
const CategoryImages = require('../../models/CategoryImages');
const Product = require('../../models/Products');
const { cloudinary } = require('../../services/Cloudinary');

module.exports.getAll = async (req, res) => {
  const categories = await Category.findAll({
    order: [
      ['name', 'ASC'],
      ['productQuantity', 'DESC'],
    ],
    where: sequelize.literal('categories.deletedAt IS NULL'),
  });
  res.status(200).json({ body: categories });
};

module.exports.getAllForAdmin = async (req, res) => {
  const categories = await Category.findAll({
    order: [
      ['name', 'ASC'],
      ['productQuantity', 'DESC'],
    ],
    include: [{ model: CategoryImages, as: 'images' }, { model: Product }],
    // where: sequelize.literal('categories.deletedAt IS NULL'),
  });

  res.render('category.ejs', { categories });
};

module.exports.getOneCategoryForAdmin = async (req, res) => {
  const category = await Category.findByPk(req.params.id, { include: [{ model: Product, as: 'products' }, { model: CategoryImages, as: 'images' }] });
  if (!category) {
    return res.status(400).send({ message: 'Category does not exist' });
  }

  res.render('categoryDetail.ejs', { category });
};

module.exports.getOne = async (req, res) => {
  const category = await Category.findByPk(req.params.id, { include: { model: Product, as: 'products' } });
  if (!category) {
    return res.status(400).send({ message: 'Category does not exist' });
  }

  res.status(200).json({ body: category });
};

module.exports.createOne = async (req, res) => {
  const response = await cloudinary.uploader.upload(`public/${req.file.originalname}`, { folder: 'upload', upload_preset: 'ml_default' });
  req.body.thumbnail = response.url;

  req.body.productQuantity = 0;

  const category = await Category.create(req.body);

  res.redirect(`/categories/${category.id}`);
};

module.exports.updateOne = async (req, res) => {
  const { id } = req.params;

  if (req.file) {
    const response = await cloudinary.uploader.upload(`public/${req.file.originalname}`, { folder: 'upload', upload_preset: 'ml_default' });
    req.body.thumbnail = response.url;
  }

  const category = await Category.findByPk(id, { include: { model: CategoryImages, as: 'images' } });
  if (!category) {
    return res.status(400).send({ message: 'Product does not exist' });
  }

  category.update(req.body);

  res.render('categoryDetail.ejs', { category });
};

module.exports.updateThumbnail = async (req, res) => {
  const { image } = req.body;
  const { id } = req.params;
  await CategoryImages.update({ status: 'optional' }, { where: { categoryID: id } });
  await CategoryImages.update({ status: 'default' }, { where: { id: image } });

  res.redirect(`/categories/${id}`);
};

module.exports.deletedOne = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);
  if (!category) {
    return res.status(400).send({ message: 'Category does not exist' });
  }

  category.update({ deletedAt: moment() });

  res.redirect('/categories');
};
