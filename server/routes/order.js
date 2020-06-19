const express = require('express');
const { userById, addPurchaseToUserHistory } = require('../controllers/user');
const { requiredSignin, isAuth, isAdmin} = require('../controllers/auth');
const { orderById, create, listOrders,getStatusValues, updateOrderStatus } = require('../controllers/order');
const { handleQuantity } = require('../controllers/product');

const router = express.Router();

router.post('/order/create/:userId', requiredSignin, isAuth, addPurchaseToUserHistory, handleQuantity, create);
router.get('/order/list/:userId', requiredSignin, isAuth, isAdmin, listOrders);
router.get('/order/status-values/:userId', requiredSignin, isAuth, isAdmin, getStatusValues);
router.put('/order/:orderId/status/:userId', requiredSignin, isAuth, isAdmin, updateOrderStatus);

router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;