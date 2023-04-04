const router = require('express').Router();
const ErrorNotFound = require('../errors/ErrorNotFound');

const userRouter = require('./user');
const cardRouter = require('./card');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страница по данному маршруту не найдена'));
});

module.exports = router;
