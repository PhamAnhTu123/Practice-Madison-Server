const Category = require("../../models/Categories")
const Product = require("../../models/Products")

module.exports.getAll = async (req, res) => {
  const categories = await Product.findAll( { order: [
    ['name', 'ASC'],
    ['price', 'DESC']
  ], include: { model: Category, as: 'category' } });

  res.status(200).json({ body: categories });
}

module.exports.getOne = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: { model: Category, as: 'category' } });
  if (!product) {
    return res.status(400).send({ message: 'Product does not exist' });
  }

  res.status(200).json({ body: product });
}