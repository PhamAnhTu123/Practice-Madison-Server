const JWT = require('jsonwebtoken');

class Jwt {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.expiresIn = process.env.JWT_EXPIRATION || '7d';
  }

  issue(payload, expires) {
    return JWT.sign(payload, this.secret, {
      expiresIn: expires || this.expiresIn,
    });
  }

  verify(token) {
    return JWT.verify(token, this.secret);
  }
}

module.exports = Jwt;