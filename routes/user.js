const express = require('express');
const { userById } = require('../controllers/user');
const { requiredSignin, 
        isAuth, 
        isAdmin 
    } = require('../controllers/auth');

const router = express.Router();

router.get('/secret/:userId', requiredSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
})

// any-time there will be userId in params
// this route/middleware will be called
router.param('userId', userById);


module.exports = router;