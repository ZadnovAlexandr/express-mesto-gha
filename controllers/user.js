const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { STATUS_OK, STATUS_CREATED } = require('../errors/errors');

const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorInternalServer = require('../errors/ErrorInternalServer');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');
const ErrorConflict = require('../errors/ErrorConflict');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((users) => res.status(STATUS_CREATED).send({
      name: users.name,
      about: users.about,
      avatar: users.avatar,
      email: users.email,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorBadRequest('Некорректные данные'));
      } else if (error.code === 11000) {
        next(
          new ErrorConflict('Пользователь с данным email уже зарегистрирован'),
        );
      } else {
        next(new ErrorInternalServer('На сервере произошла ошибка'));
      }
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь не найден'));
      } else {
        res.status(STATUS_OK).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorBadRequest('Введен некорректный ID пользовател'));
      } else {
        next(new ErrorInternalServer('На сервере произошла ошибка'));
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные для редактирования пользователя',
          ),
        );
      } else if (error.name === 'DocumentNotFoundError') {
        next(new ErrorNotFound('Пользователь не найден'));
      } else {
        next(new ErrorInternalServer('На сервере произошла ошибка'));
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные для редактирования пользователя',
          ),
        );
      } else if (error.name === 'DocumentNotFoundError') {
        next(new ErrorNotFound('Пользователь не найден'));
      } else {
        next(new ErrorInternalServer('На сервере произошла ошибка'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        return next(new ErrorUnauthorized('Неправильные почта или пароль'));
      }
      const data = await bcrypt.compare(password, user.password);
      if (data) {
        const token = jwt.sign({ _id: user._id }, 'SECRET-KEY', {
          expiresIn: '7d',
        });
        return res
          .cookie('jwt', token, {
            httpOnly: true,
          })
          .send({ message: 'Вход выполнен!' });
      }
      return next(new ErrorUnauthorized('Неправильные почта или пароль'));
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
