const express = require('express');
const { userById, addPurchaseToUserHistory } = require('../controllers/user');
const { requiredSignin, isAuth} = require('../controllers/auth');
const { create } = require('../controllers/order');

const router = express.Router();

router.post('/order/create/:userId', requiredSignin, isAuth, addPurchaseToUserHistory, create);

router.param('userId', userById);

module.exports = router;