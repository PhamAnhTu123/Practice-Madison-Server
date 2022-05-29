const userStatus = {
  pending: 'pending',
  blocked: 'blocked',
  active: 'active',
};

const authStatus = {
  available: 'available',
  disable: 'disable',
};

const mediaStatus = {
  default: 'default',
  optional: 'optional',
};

const sort = {
  price: 'price',
  date: 'date',
};

const paymentMethod = {
  visa: 'visa',
  cash: 'cash',
};

const paymentStatus = {
  pendingPayment: 'pending payment',
  paymentSuccess: 'payment success',
};

module.exports = {
  userStatus, authStatus, mediaStatus, sort, paymentMethod, paymentStatus,
};
