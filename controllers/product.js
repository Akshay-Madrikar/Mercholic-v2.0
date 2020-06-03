const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = async(req ,res, next, id) => {
    try{
        const product = await Product.findById(id).exec();
        if(!product) {
            throw new Error();
        }
        req.product = product;
        next();
    } catch(error) {
        res.status(404).json({
            error: 'No such product!'
        });
    }
};

exports.read = async(req, res) => {
    req.product.photo = undefined;
    return res.status(200).json(req.product);
};

exports.remove = async (req, res) => {
    try{
        let product = req.product;
        await product.remove();
        const { _id, name, category } = product
        res.status(200).json({
            product: {_id, name , category},
            message: 'Product deleted successfully'
        });
    } catch(error) {
        res.status(400).json({
            error: errorHandler(error)
        });
    }
    

};

exports.create =  (req, res) => {
    try{
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if(err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                });
            };

            const { name, description, price, category, quantity, shipping } = fields;
            if(!name || !description || !price || !category || !quantity || !shipping) {
                return res.status(400).json({
                    error: 'All fields are required!'
                });
            };

            let product = new Product(fields);
            if(files.photo) {
                if(files.photo.size > 1000000) {
                    return res.status(400).json({
                        error: 'Image size should be less than 1mb'
                    });
                }
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType = files.photo.type;
            };

            await product.save();
            res.status(201).json({
                product
            });
        });
        
    } catch(error) {
        res.status(400).json({
            error: errorHandler(error)
        });
    };
};

exports.update =  (req, res) => {
    try{
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if(err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                });
            };

            const { name, description, price, category, quantity, shipping } = fields;
            if(!name || !description || !price || !category || !quantity || !shipping) {
                return res.status(400).json({
                    error: 'All fields are required!'
                });
            };

            let product = req.product;

            // _ comes from lodash library
            // Lodash makes JavaScript easier by taking the hassle out of working with arrays, numbers, objects, strings, etc.
            product = _.extend(product, fields);
            
            if(files.photo) {
                if(files.photo.size > 1000000) {
                    return res.status(400).json({
                        error: 'Image size should be less than 1mb'
                    });
                }
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType = files.photo.type;
            };

            await product.save();
            res.status(201).json({
                product
            });
        });
        
    } catch(error) {
        res.status(400).json({
            error: errorHandler(error)
        });
    };
};