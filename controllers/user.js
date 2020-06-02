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