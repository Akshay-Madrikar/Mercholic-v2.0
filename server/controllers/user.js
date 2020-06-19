const User = require('../models/user');
const Order = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

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

exports.addPurchaseToUserHistory = async (req, res, next) => {
    try {   
        let history = [];

        req.body.order.products.forEach((item) => {
            history.push({
                _id: item._id,
                name: item.name,
                description: item.description,
                category: item.category,
                quantity: item.count,
                transaction_id: req.body.order.transaction_id,
                amount: req.body.order.amount
            });
        });

        await User.findByIdAndUpdate({
            _id: req.profile._id
        }, {
            $push: {
                history: history
            }
        }, {
            new: true
        });

        next();
    } catch(error) {
        res.status(400).json({
            error: 'Could not update user purchase history!'
        });
    }
};

exports.purchaseHistory = async (req, res) => {
    try{
        const orderHistory = await Order.find({ user: req.profile._id })
                                        .populate('user', '_id name')
                                        .sort('-created')
                                        .exec();
        res.status(200).json(orderHistory);
    } catch(error) {
        res.status(400).json({
            error: 'Unable to fetch history'
        });
    }
};