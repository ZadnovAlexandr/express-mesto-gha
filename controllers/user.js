const User = require('../models/user');

const {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.send(users);
  });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((users) => res.status(STATUS_CREATED).send(users))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: error.message });
      } return res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        res.status(STATUS_OK).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: 'Введен некорректный ID пользовател' });
      } else if (error.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail((error) => {
      res.status(ERROR_NOT_FOUND).send({ message: error.message });
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({
          message:
            'Переданы некорректные данные для редактирования пользователя',
        });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail((error) => {
      res.status(ERROR_NOT_FOUND).send({ message: error.message });
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({
          message:
            'Переданы некорректные данные для редактирования пользователя',
        });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  createUser, getUsers, getUser, updateUser, updateAvatar,
};
