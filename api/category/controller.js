const Category = require("../../models/Categories")
const Product = require("../../models/Products")

module.exports.getAll = async (req, res) => {
  const categories = await Category.findAll({order: [
    ['name', 'ASC'],
    ['productQuantity', 'DESC']
  ] , include: [ { model: Product, as: 'products' } ] });
  res.status(200).json({ body: categories });
}

module.exports.getOne = async (req, res) => {
  const category = await Category.findByPk(req.params.id, { include: { model: Product, as: 'products' } });
  if (!category) {
    return res.status(400).send({ message: 'Category does not exist' });
  }

  res.status(200).json({ body: category });
}