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

  compare(password, hash) {
    return Bcrypt.compare(password, hash);
  }

  compareSync(password, hash) {
    return Bcrypt.compareSync(password, hash);
  }
}

module.exports =  BcryptUtils;