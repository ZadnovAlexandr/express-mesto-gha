const User = require("../models/user");

const {
  STATUS_OK, //200
  STATUS_CREATED, //201
  ERROR_BAD_REQUEST, //400
  ERROR_NOT_FOUND, //404
  ERROR_INTERNAL_SERVER, //500
} = require("../errors/errors");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({ message: error.message });
      } else {
        return res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: "На сервере произошла ошибка" });
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((users) => res.status(STATUS_CREATED).send(users))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({ message: error.message });
      } else {
        return res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: "На сервере произошла ошибка" });
      }
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (req.params.userId.length !== 24) {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message:"Введен некорректный ID пользователя"});
      } else if (error.name === "DocumentNotFoundError") {
        return res.status(ERROR_NOT_FOUND).send("Пользователь не найден");
      } else {
        return res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: "На сервере произошла ошибка" });
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      res.status(ERROR_NOT_FOUND).send({ message: error.message });
    })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send("Пользователь не найден");
      }
      res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(ERROR_BAD_REQUEST)
          .send("Переданы некорректные данные для редактирования пользователя");
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      res.status(ERROR_NOT_FOUND).send({ message: error.message });
    })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send("Пользователь не найден");
      }
      res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(ERROR_BAD_REQUEST)
          .send("Переданы некорректные данные для редактирования пользователя");
      }
    })
    .catch(next);
};

module.exports = { createUser, getUsers, getUser, updateUser, updateAvatar };
