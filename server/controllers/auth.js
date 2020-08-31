const User = require('../models/user');
require('dotenv').config();
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = async (req, res) => {
    try{
        const user = new User(req.body);
        await user.save();
        res.status(201).json({
            user
        });
    } catch(error) {
        res.status(400).json({
            error
        });
    }
};

exports.signin = async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, {
            expire: new Date() + 9999
        });

        const {_id, name, email, role} = user;
        res.status(202).json({
            user: {_id, name, email, role},
            token
        });
    } catch(error) {
        res.status(400).json({
            error: 'Email or Password do not match'
    })
    }
};

exports.signout = (req , res) => {
    res.clearCookie('t');
    res.status(200).json({
        message: 'Signout sucess'
    });
};

// make sure we have cookie-parser installed to use expressJwt
exports.requiredSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user) {
        return res.status(401).json({
            error: 'Access denied'
        });
    };
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(401).json({
            error: 'Admin resource! Access denied'
        });
    };
    next();
};