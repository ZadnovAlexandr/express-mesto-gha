const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  try {
    const payload = jwt.verify(token, 'SECRET-KEY');
    req.user = payload;
    next();
  } catch (error) {
    next(new ErrorUnauthorized('Для дальнейшего доступа необходима авторизация'));
  }
};

module.exports = { auth };
