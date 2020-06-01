const User = require('../models/user');
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
            error: errorHandler(error) || error
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
            error: errorHandler(error) || error
        });
    }
};