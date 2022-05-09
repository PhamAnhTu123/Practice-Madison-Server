const Category = require("../../models/Categories")
const Product = require("../../models/Products")

module.exports.getAll = async (req, res) => {
  const categories = await Product.findAll({ include: { model: Category, as: 'category' } });
  res.status(200).json({ body: categories });
}