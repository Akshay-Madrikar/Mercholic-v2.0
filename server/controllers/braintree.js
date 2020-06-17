const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.generateToken = async (req, res) => {
    try {
        const token = await gateway.clientToken.generate({});
        res.status(200).send(token);
    } catch(error) {
        res.status(500).json({
            error
        });
    };
};

exports.processPayment = async (req, res) => {
    try {
        let nonceFromTheClient = req.body.paymentMethodNonce
        let amountFromTheClient = req.body.amount
    
        //charge
        const  newTransaction = await gateway.transaction.sale({
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        });
        res.status(200).json(newTransaction);
    } catch(error) {
        res.status(500).json(error);
    }
};