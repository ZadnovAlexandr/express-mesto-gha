const Card = require("../models/card");

const {
  STATUS_OK, //200
  STATUS_CREATED, //201
  ERROR_BAD_REQUEST, //400
  ERROR_FORBIDDEN, //403
  ERROR_NOT_FOUND, //404
  ERROR_INTERNAL_SERVER, //500
} = require("../errors/errors");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
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

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send(card))
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

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Карточка не найдена" });
      }
      if (String(card.owner) !== req.user._id) {
        throw res
          .status(ERROR_FORBIDDEN)
          .send({ message: "Можно удалить только свои карточки" });
      }
      Card.deleteOne({ _id: card._id })
        .then(() => {
          res.status(STATUS_OK).send({ card });
        })
        .catch(next);
    })
    .catch((error) => {
      if (error.name === "CastError") {
          res
            .status(ERROR_NOT_FOUND)
            .send({ message: "Переданы некорректные данные" })
      } else {
        next(error);
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw res
        .status(ERROR_NOT_FOUND)
        .send({ message: "Карточка не найдена" });
    })
    .then(() =>
      res.status(STATUS_OK).send({ message: "Карточке поставлен лайк" })
    )
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(ERROR_BAD_REQUEST).send({ message: error.message });
      } else if (error.message === "NotFound") {
        res.status(ERROR_NOT_FOUND).send({
          message: error.message,
        });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: "На сервере произошла ошибка" });
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw res
        .status(ERROR_NOT_FOUND)
        .send({ message: "Карточка не найдена" });
    })
    .then(() =>
      res.status(STATUS_OK).send({ message: "У карточки удален лайк" })
    )
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(ERROR_BAD_REQUEST).send({ message: error.message });
      } else if (error.message === "NotFound") {
        res.status(ERROR_NOT_FOUND).send({
          message: error.message,
        });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: "На сервере произошла ошибка" });
      }
    })
    .catch(next);
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
