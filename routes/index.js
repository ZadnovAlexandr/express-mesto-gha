const router = require("express").Router();
const { ERROR_NOT_FOUND } = require("../errors/errors");

const userRouter = require("./user");
const cardRouter = require("./card");

router.use("/users", userRouter);
router.use("/cards", cardRouter);
router.use("*", (req, res, next) => {
  next(
    res.status(ERROR_NOT_FOUND).send({ message: "Страница по данному маршруту не найдена"})
  );
});

module.exports = router;
