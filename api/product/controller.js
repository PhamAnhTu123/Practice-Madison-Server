/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
const fs = require('fs');
const sequelize = require('../../connection');
const Category = require('../../models/Categories');
const ProductCategories = require('../../models/ProductCategories');
const ProductImages = require('../../models/ProductImages');
const Product = require('../../models/Products');
const OrderItem = require('../../models/OrderItem');
const { cloudinary } = require('../../services/Cloudinary');
const ERROR = require('../../constants/errors');
const { mediaStatus } = require('../../constants/comon');

module.exports.getAll = async (req, res) => {
  let products;
  const limit = 5;
  products = await Product.findAndCountAll({
    include: [{ model: Category, as: 'categories' }, { model: ProductImages, as: 'images', where: { status: 'default' } }],
    where: sequelize.literal('products.deletedAt IS NULL'),
    offset: limit * (req.query.pages ? req.query.pages - 1 : 0),
    limit,
    distinct: true,
  });
  if (req.query.order) {
    if (req.query.order === 'name') {
      products = await Product.findAll({
        order: [
          ['name', 'ASC'],
        ],
        include: [{ model: Category, as: 'categories' }, { model: ProductImages, as: 'images', where: { status: 'default' } }],
        where: sequelize.literal('products.deletedAt IS NULL'),
        offset: limit * (req.query.pages ? req.query.pages - 1 : 0),
        limit,
        distinct: true,
      });
    } else {
      products = await Product.findAll({
        order: [
          ['price', 'DESC'],
        ],
        include: [{ model: Category, as: 'categories' }, { model: ProductImages, as: 'images', where: { status: 'default' } }],
        where: sequelize.literal('products.deletedAt IS NULL'),
        offset: limit * (req.query.pages ? req.query.pages - 1 : 0),
        limit,
        distinct: true,
      });
    }
  }
  if (req.query.category) {
    // eslint-disable-next-line max-len
    const filteredProducts = {
      // eslint-disable-next-line max-len
      rows: products.rows.filter((product) => product.categories.some((category) => category.id == req.query.category)),
      count: products.count,
    };
    return res.status(200).json({ body: filteredProducts });
  }
  res.status(200).json({ body: products });
};

module.exports.getAllForAdmin = async (req, res) => {
  const limit = 5;
  const products = await Product.findAndCountAll({
    order: [
      ['name', 'ASC'],
      ['price', 'DESC'],
    ],
    include: [{ model: Category }, { model: ProductImages, as: 'images' }],
    where: sequelize.literal('products.deletedAt IS NULL'),
    offset: limit * (req.query.pages ? req.query.pages - 1 : 0),
    limit,
    distinct: true,
  });

  res.render('product.ejs', { products: products.rows, pages: products.count });
};

module.exports.createProduct = async (req, res) => {
  const categories = await Category.findAll();
  res.render('productCreate.ejs', { categories });
};

module.exports.getOneForAdmin = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: [{ model: Category }, { model: ProductImages, as: 'images' }] });
  if (!product) {
    return res.status(400).send({ message: ERROR.PRODUCT_DOES_NOT_EXIST });
  }

  res.render('productDetail.ejs', { product });
};

module.exports.getOne = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: { model: Category, as: 'category' } });
  if (!product) {
    return res.status(400).send({ message: ERROR.PRODUCT_DOES_NOT_EXIST });
  }

  res.status(200).json({ body: product });
};

module.exports.createOne = async (req, res) => {
  const {
    name, description, storage, price, categories,
  } = req.body;

  const product = await Product.create({
    name,
    description,
    storage,
    price,
  });

  req.files.forEach(async (file, index) => {
    const response = await cloudinary.uploader.upload(
      `public/${file.originalname}`,
      { folder: 'upload', upload_preset: 'ml_default' },
    );
    fs.unlinkSync(`public/${file.originalname}`);
    if (index === 0) {
      await ProductImages.create({
        productID: product.id,
        url: response.url,
        status: mediaStatus.default,
      });
    } else {
      await ProductImages.create({
        productID: product.id,
        url: response.url,
        status: mediaStatus.optional,
      });
    }
  });

  categories.map(async (item) => {
    const producCategory = await ProductCategories.create({
      productID: product.id,
      categoryID: item,
    });

    const category = await Category.findOne({ where: { id: item }, include: Product });
    await category.update({ productQuantity: category.products.length });

    return producCategory;
  });

  res.redirect(`/products/${product.id}`);
};

module.exports.updateThumbnail = async (req, res) => {
  const { image } = req.body;
  const { id } = req.params;
  await ProductImages.update({ status: 'optional' }, { where: { productID: id } });
  await ProductImages.update({ status: 'default' }, { where: { id: image } });

  res.redirect(`/products/${id}`);
};

module.exports.updateOne = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(400).send({ message: ERROR.PRODUCT_DOES_NOT_EXIST });
  }

  if (req.file) {
    const response = await cloudinary.uploader.upload(`public/${req.file.originalname}`, { folder: 'upload', upload_preset: 'ml_default' });
    req.body.thumbnail = response.url;
  }

  await product.update(req.body);

  res.redirect(`/products/${id}`);
};

module.exports.deletedOne = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id, { include: { model: OrderItem, as: 'order_items' } });
  if (!product) {
    return res.status(400).send({ message: ERROR.PRODUCT_DOES_NOT_EXIST });
  }

  if (product.order_items.length > 0) {
    return res.status(400).send({ message: ERROR.CAN_NOT_DELETE_THIS_PRODUCT });
  }

  await ProductImages.destroy({ where: { productID: product.id } });
  await ProductCategories.destroy({ where: { productID: product.id } });
  await product.destroy();

  res.redirect('/products');
};
