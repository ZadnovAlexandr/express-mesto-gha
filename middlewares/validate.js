const { Joi, celebrate } = require('celebrate');

const urlRegExp = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const getUserVal = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

const createUsersVal = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.require': 'Введен некорректный email',
    }),
    password: Joi.string().required().messages({
      'any.require': 'Введен некорректный пароль',
    }),
    name: Joi.string().min(2).max(30).messages({
      'any.require': 'Введено некорректное имя пользователя',
    }),
    about: Joi.string().min(2).max(30).messages({
      'any.require': 'Введена некорректная профессия пользователя',
    }),
    avatar: Joi.string().pattern(urlRegExp).messages({
      'any.require': 'Введена некорректная ссылка аватара пользователя',
    }),
  }),
});

const updateUserVal = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'any.require': 'Введено некорректное имя пользователя',
    }),
    about: Joi.string().min(2).max(30).messages({
      'any.require': 'Введена некорректная профессия пользователя',
    }),
  }),
});

const updateAvatarVal = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegExp).messages({
      'any.require': 'Введена некорректная ссылка аватара пользователя',
    }),
  }),
});

const loginVal = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.require': 'Введен некорректный email',
    }),
    password: Joi.string().required().messages({
      'any.require': 'Введен некорректный пароль',
    }),
  }),
});

const getCardVal = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

const createCardVal = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.require': 'Введено некорректное название карточки',
      }),
    link: Joi.string().required().pattern(urlRegExp).messages({
      'any.require': 'Введена некорректная ссылка карточки',
    }),
  }),
});

module.exports = {
  getUserVal,
  createUsersVal,
  updateUserVal,
  updateAvatarVal,
  loginVal,
  getCardVal,
  createCardVal,
};
