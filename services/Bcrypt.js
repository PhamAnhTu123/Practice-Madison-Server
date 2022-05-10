const Bcrypt = require('bcrypt');

class BcryptUtils {
  constructor() {
    this.saltRounds = 10;
  }

  hash(password) {
    return Bcrypt.hash(password, this.saltRounds);
  }

  hashSync(password) {
    return Bcrypt.hashSync(password, this.saltRounds);
  }

  // eslint-disable-next-line class-methods-use-this
  compare(password, hash) {
    return Bcrypt.compare(password, hash);
  }

  // eslint-disable-next-line class-methods-use-this
  compareSync(password, hash) {
    return Bcrypt.compareSync(password, hash);
  }
}

module.exports = BcryptUtils;
