const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const method = (value) => {
  const result = validator.isEmail(value);
  if (result) {
    return value;
  }
  throw new Error('Email validation err');
};

const {
  getUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom(method),
  }),
}), updateUser);

module.exports = router;
