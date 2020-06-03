const express = require('express');
const { userById, read, update } = require('../controllers/user');
const { requiredSignin, 
        isAuth, 
        isAdmin 
    } = require('../controllers/auth');

const router = express.Router();

router.get('/secret/:userId', requiredSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
});

router.get('/user/:userId', requiredSignin, isAuth, read);
router.put('/user/:userId', requiredSignin, isAuth, update);

// any-time there will be userId in params
// this route/middleware will be called
router.param('userId', userById);


module.exports = router;