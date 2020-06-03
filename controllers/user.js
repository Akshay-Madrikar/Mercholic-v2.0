const User = require('../models/user');

exports.userById = async (req, res ,next , id) => {
    try{
        const user = await User.findById(id).exec();
        if(!user) {
            throw new Error();
        };
    
        req.profile = user;
        next();
    } catch(error) {
        res.status(400).json({
            error: 'No such user!'
        })
    }
};

exports.read = async(req, res) => {
    try {
        req.profile.password = undefined;
        res.status(200).json(req.profile);
    } catch(error) {
        res.status(400).json({
            error: 'No such user!'
        })
    };
};

exports.update = async(req, res) => {
    try {
        const user = await User.findOneAndUpdate({
            _id: req.profile._id
        }, {
            $set: req.body
        }, {
            new: true
        });
        user.password = undefined;
        res.status(200).json(user);
    } catch(error) {
        res.status(400).json({
            error: 'You are not allowed to perform this action!'
        })
    };
};