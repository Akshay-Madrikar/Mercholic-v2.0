const sgMail = require('@sendgrid/mail');
const { Order } = require('../models/order');

const sendgridApiKey = 'SG.' + process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridApiKey);

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

        // send email alert to admin
        // order.address
        // order.products.length
        // order.amount
        const emailData = {
            to: 'akshaymadrikar@gmail.com', // admin
            from: 'noreply@mercholic.com',
            subject: `A new order is received`,
            html: `
            <h1>Hey Admin, Somebody just made a purchase</h1>
            <h2>Customer name: ${order.user.name}</h2>
            <h2>Customer address: ${order.address}</h2>
            <h2>User's purchase history: ${order.user.history.length} purchase</h2>
            <h2>User's email: ${order.user.email}</h2>
            <h2>Total products: ${order.products.length}</h2>
            <h2>Transaction ID: ${order.transaction_id}</h2>
            <h2>Order status: ${order.status}</h2>
            <h2>Product details:</h2>
            <hr />
            ${order.products
                .map(p => {
                    return `<div>
                        <h3>Product Name: ${p.name}</h3>
                        <h3>Product Price: ${p.price}</h3>
                        <h3>Product Quantity: ${p.count}</h3>
                </div>`;
                })
                .join('--------------------')}
            <h2>Total order cost: ${order.amount}<h2>
            <p>Login to your dashboard</a> to see the order in detail.</p>
        `
        };

        await sgMail.send(emailData);

        const emailData2 = {
            to: order.user.email,
            from: 'noreply@mercholic.com',
            subject: `You order is in process`,
            html: `
            <h1>Hey ${req.profile.name}, Thank you for shopping with us.</h1>
            <h2>Total products: ${order.products.length}</h2>
            <h2>Transaction ID: ${order.transaction_id}</h2>
            <h2>Order status: ${order.status}</h2>
            <h2>Product details:</h2>
            <hr />
            ${order.products
                .map(p => {
                    return `<div>
                        <h3>Product Name: ${p.name}</h3>
                        <h3>Product Price: ${p.price}</h3>
                        <h3>Product Quantity: ${p.count}</h3>
                </div>`;
                })
                .join('--------------------')}
            <h2>Total order cost: ${order.amount}<h2>
            <p>Thank your for shopping with us.</p>
        `
        };
        await sgMail.send(emailData2);
            
        res.status(201).json(order);
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