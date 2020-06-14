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

exports.list = async (req ,res) => {
    // by sell - /products?sortBy=sold&order=desc&limit=4
    // by arrivals - /products?sortBy=createdAt&order=desc&limit=4
    // if no params - /products
    try{
        let order = req.query.order ? req.query.order : 'asc';
        let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
        let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    
        const products = await Product.find()
                                .select('-photo')
                                .populate('category')
                                .sort([[sortBy, order]])
                                .limit(limit)
                                .exec();
        res.status(200).json(products);
    } catch(error) {
        res.status(400).json({
            error: errorHandler(error)
        });
    } 
};

exports.listRelated = async(req, res) => {
    try{
        let limit = req.query.limit ? parseInt(req.query.limit) : 6;

        const products = await Product.find({
            _id: {
                $ne: req.product
            },
            category: req.product.category
        }).limit(limit)
        .populate('category', '_id name')
        .exec();

        res.status(200).json(products);
    } catch(error) {
        res.status(400).json({
            error: 'Products not found!'
        });
    }
};

exports.listProductCategories = async(req, res) => {
    try{
        const categories = await Product.distinct('category', {});
        res.status(200).json(categories);
    } catch(error) {
        res.status(400).json({
            error: 'Categories not found!'
        });
    }
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
exports.listBySearch = async (req, res) => {
    try {
        let order = req.body.order ? req.body.order : "desc";
        let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
        let limit = req.body.limit ? parseInt(req.body.limit) : 100;
        let skip = parseInt(req.body.skip);
        let findArgs = {};
     
        // console.log(order, sortBy, limit, skip, req.body.filters);
        // console.log("findArgs", findArgs);
     
        for (let key in req.body.filters) {
            if (req.body.filters[key].length > 0) {
                if (key === "price") {
                    // gte -  greater than price [0-10]
                    // lte - less than
                    findArgs[key] = {
                        $gte: req.body.filters[key][0],
                        $lte: req.body.filters[key][1]
                    };
                } else {
                    findArgs[key] = req.body.filters[key];
                }
            }
        }
     
        const productsBySearch = await Product.find(findArgs)
            .select("-photo")
            .populate("category")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec();

        res.json({
            size: productsBySearch.length,
            productsBySearch
        });
    } catch(error) {
        res.status(400).json({
            error: 'Products not found!'
        });
    }
};

exports.photo = (req ,res ,next) => {
    if(req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    };
    next();
};

exports.listSearch = async (req, res) => {
    // To hold search and category values 
    let query = {};
    //assign search value to query.name
    if(req.query.search) {
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        }

        //assign category value to  query.category
        if(req.query.category && req.query.category !== 'All') {
            query.category = req.query.category
        }
        
        try {
            //Now we'll find products based on search and category
            const products = await Product.find(query).select('-photo');
            res.status(200).json(products);
        } catch (error) {
            res.status(400).json({
                error: 'Products not found!'
            });
        }
    }
};