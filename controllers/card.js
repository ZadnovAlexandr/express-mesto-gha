const Card = require('../models/card');

const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorInternalServer = require('../errors/ErrorInternalServer');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorForbidden = require('../errors/ErrorForbidden');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else {
        next(new ErrorInternalServer('На сервере произошла ошибка'));
      }
    });
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === userId) {
        Card.findByIdAndDelete(req.params.cardId)
          .then((c) => {
            res.send(c);
          })
          .catch(next);
      } else {
        next(
          new ErrorForbidden(
            'Вы не можете удалить карточку, созданную другим пользователем',
          ),
        );
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else if (error.name === 'DocumentNotFoundError') {
        next(new ErrorNotFound('Карточка с указанным id не найдена'));
      } else {
        next(new ErrorInternalServer('На сервере произошла ошибка'));
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else if (error.name === 'DocumentNotFoundError') {
        next(new ErrorNotFound('Карточка с указанным id не найдена'));
      } else {
        next(new ErrorInternalServer('На сервере произошла ошибка'));
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else if (error.name === 'DocumentNotFoundError') {
        next(new ErrorNotFound('Карточка с указанным id не найдена'));
      } else {
        next(new ErrorInternalServer('На сервере произошла ошибка'));
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
