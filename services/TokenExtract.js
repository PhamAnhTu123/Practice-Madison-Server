const Jwt = require('./JWT');

const jwt = new Jwt();

module.exports.tokenExtract = (req) => {
  const bearer = req.headers.authorization;
  const bearerToken = bearer.split(' ')[1];
  const tokenDecoded = jwt.verify(bearerToken);

  return tokenDecoded;
};
