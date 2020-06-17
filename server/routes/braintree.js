const express = require('express');
const { userById } = require('../controllers/user');
const { requiredSignin, isAuth} = require('../controllers/auth');
const { generateToken, processPayment } = require('../controllers/braintree');

const router = express.Router();

router.get('/braintree/getToken/:userId', requiredSignin, isAuth, generateToken);
router.post('/braintree/payment/:userId', requiredSignin, isAuth, processPayment);

router.param('userId', userById);

module.exports = router;