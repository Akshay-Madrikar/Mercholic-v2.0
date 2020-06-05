const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = async(req, res, next, id) => {
    try{
        const category = await Category.findById(id).exec();
        if(!category) {
            throw new Error();
        }
        req.category = category;
        next();
    } catch(error) {
        res.status(400).json({
            error: 'No such category!'
        });
    }
};

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
};

exports.read = (req, res) => {
    res.status(200).json(req.category);
};

exports.update = async(req, res) => {
    try{
        const category = req.category;
        category.name = req.body.name;
        await category.save();
        res.status(200).json(category);
    } catch(error) {
        res.status(400).json({
            error: errorHandler(error)
        });
    }
};

exports.remove = async(req, res) => {
    try{
        let category = req.category;
        const {_id, name} = category;
        await category.remove();
        res.status(200).json({
            category: {_id, name},
            message: 'Category deleted successfully'
        });
    } catch(error) {
        res.status(400).json({
            error: errorHandler(error)
        });
    }
    
};

exports.list = async(req, res) => {
    try{
        const categories = await Category.find({});
        res.status(200).json(categories);        
    } catch(error) {
        res.status(400).json({
            error: errorHandler(error)
        });
    }
}