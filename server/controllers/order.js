const { Order, CartItem } = require('../models/order');

exports.orderById = async(req, res, next, id) => {
    try {
        const order = await Order.findById(id)
        .populate('products.product', 'name price')
        .exec();

        if(!order) {
            throw new Error();
        };

        req.order = order;
        next();
    } catch(error) {
        res.status(400).json({
            error: 'No such order!'
        });
    }
};

exports.create = async (req ,res) => {
    try {
        req.body.order.user = req.profile;
        const order = new Order(req.body.order);
        await order.save();
        res.status(201).json(order)
    } catch(error) {
        res.status(400).json({
            error: 'No such category!'
        });
    }
};

exports.listOrders = async(req, res) => {
    try {
        const orders = await Order.find()
                    .populate('user', '_id name address')
                    .exec();
        res.status(201).json(orders)
    } catch(error) {
        res.status(400).json({
            error
        });
    }
};

exports.getStatusValues = (req, res) => {
    res.status(200).json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.update({
            _id: req.body.orderId
        }, {
            $set: {
                status: req.body.status
            }
        });

        res.status(200).json(order);
    } catch(error) {
        res.status(400).json({
            error
        });
    }
};