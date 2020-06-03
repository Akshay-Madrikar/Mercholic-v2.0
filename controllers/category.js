const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = async (req, res) => {
    try{
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({
            category
        })
    } catch(error) {
        res.status(400).json({
            error: errorHandler(error)
        });
    };
    
}