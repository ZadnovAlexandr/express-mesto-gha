const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const { login, createUser } = require('./controllers/user');
const { auth } = require('./middlewares/auth');

const {
  createUsersVal,
  loginVal,
} = require('./middlewares/validate');

const app = express();

const PORT = 3000;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('DataBase connected');
  })
  .catch((err) => {
    console.log(`Error dataBase ${err}`);
  });

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signup', createUsersVal, createUser);
app.post('/signin', loginVal, login);
app.use(auth);
app.use('/', router);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (statusCode === 500) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
    next();
  } else {
    res.status(statusCode).send({ message: err.message });
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Connection on the port ${PORT}`);
});
