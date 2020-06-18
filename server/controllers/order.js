const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

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