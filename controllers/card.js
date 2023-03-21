const Card = require('../models/card');

const {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_BAD_REQUEST,
  ERROR_FORBIDDEN,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({}).then((cards) => {
    res.send(cards);
  });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: error.message });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (String(card.owner) !== req.user._id) {
        res.status(ERROR_FORBIDDEN).send({ message: 'Можно удалить только свои карточки' });
      }
      Card.deleteOne({ _id: card._id })
        .then(() => {
          res.status(STATUS_OK).send({ card });
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then(() => res.status(STATUS_OK).send({ message: 'Карточке поставлен лайк' }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: error.message });
      } else if (error.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: error.message,
        });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then(() => res.status(STATUS_OK).send({ message: 'У карточки удален лайк' }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: error.message });
      } else if (error.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: error.message,
        });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
