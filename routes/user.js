const express = require('express');

const router = express.Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/user');

const {
  getUserVal,
  updateUserVal,
  updateAvatarVal,
} = require('../middlewares/validate');

router.get('/', getUsers);
router.get('/me', getUserVal, getUserInfo);
router.get('/:userId', getUserVal, getUser);
router.patch('/me', updateUserVal, updateUser);
router.patch('/me/avatar', updateAvatarVal, updateAvatar);

module.exports = router;
