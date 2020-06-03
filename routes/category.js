const express = require('express');
const { create } = require('../controllers/category');
const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const router = express.Router();

router.post('/category/create/:userId', requiredSignin, isAuth, isAdmin, create);

router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;