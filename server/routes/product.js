const express = require('express');
const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { productById, create, read, remove, update, list, 
        listRelated, listProductCategories, listBySearch, listSearch, photo 
    } = require('../controllers/product');

const router = express.Router();


router.post('/product/create/:userId', requiredSignin, isAuth, isAdmin, create);
router.get('/product/:productId', read);
router.put('/product/:productId/:userId', requiredSignin, isAuth, isAdmin, update);
router.delete('/product/:productId/:userId', requiredSignin, isAuth, isAdmin, remove);
router.get('/products', list);
router.get('/products/search', listSearch);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listProductCategories);
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId", photo);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;