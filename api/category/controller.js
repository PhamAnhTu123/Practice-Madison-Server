const Category = require("../../models/Categories")
const Product = require("../../models/Products")

module.exports.getAll = async (req, res) => {
  const categories = await Category.findAll({ include: [ { model: Product, as: 'products' } ] });
  res.status(200).json({ body: categories });
}