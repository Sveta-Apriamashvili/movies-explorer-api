const router = require('express').Router();

const {
  getUser,
  updateUser,
} = require('../controllers/users');

const { handleUpdateUserInfoValidation } = require('../middlewares/validation');

router.get('/users/me', getUser);
router.patch('/users/me', handleUpdateUserInfoValidation, updateUser);

module.exports = router;
