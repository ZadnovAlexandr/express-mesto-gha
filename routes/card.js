const express = require('express');

const router = express.Router();

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

const {
  getCardVal,
  createCardVal,
} = require('../middlewares/validate');

router.post('/', createCardVal, createCard);
router.get('/', getCards);
router.delete('/:cardId', getCardVal, deleteCard);
router.put('/:cardId/likes', getCardVal, likeCard);
router.delete('/:cardId/likes', getCardVal, dislikeCard);

module.exports = router;
