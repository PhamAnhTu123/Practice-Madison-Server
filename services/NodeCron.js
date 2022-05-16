const cron = require('node-cron');
const Cart = require('../models/Cart');
const Product = require('../models/Products');
const User = require('../models/Users');
const Mailer = require('./Mailer');

const mailer = new Mailer();

const noticeCron = cron.schedule('*/2 * * * *', async () => {
  const users = await User.findAll();
  await Promise.all(users.map(async (user) => {
    const cart = await Cart.findAll({ where: { userID: user.id }, include: { model: Product, as: 'product' } });
    let message = 'Here is your daily reminder\n you have something in your cart\n';
    if (cart.length > 0) {
      cart.forEach((item) => {
        message += `${item.product.name} - quantity: ${item.quantity}\n`;
      });
      const mail = mailer.message('phamanhtu12112000@gmail.com', user.email, 'Reminder', message);
      mailer.sendMail(mail);
    }
    return user;
  }));
});

module.exports = noticeCron;
