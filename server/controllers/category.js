const Category = require('../models/category');
const Product = require('../models/product');
const Sub = require('../models/sub');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        // const category = await new Category({
        //     name,
        //     slug: slugify(name).toLowerCase(),
        // }).save();
        // res.json(category);
        res.json(await new Category({ name, slug: slugify(name) }).save());
    } catch (err) {
        // console.log(err)
        res.status(400).send('Create category failed');
    }
};

exports.list = async (req, res) => {
    res.json(await Category
        .find({})
        .sort({ createdAt: -1 })
        .exec());
};

/* read method sends the category based on the slug.
 This data is exported to the frontend. The frontend 
 needs all the products associated with a category. 
 To accomplish this query the database. */
exports.read = async (req, res) => {
    /* Finds a category based on slug */
    let category = await Category
        .findOne({ slug: req.params.slug })
        .exec();
    // res.json(category);
    /* Make sure to import the product models for the 
    const products below. Because this is async, this
    needs to be placed in a variable, ie const products.
    This code needs to find products based on the 
    category, so the category_id is needed. Don't have to 
    specify the underscore in category_id, mongoose will 
    handle that for the code that is given. let category
    above has the category id, so category: category is used.
    */
    const products = await Product
        .find({ category: category })
        /* Before the json response, the code needs to be 
        populated with the category */
        .populate('category')
        .exec();
    /* category and the products associated with the category 
    will be sent. */
    res.json({
        category,
        products,
    });
};

exports.update = async (req, res) => {
    const { name } = req.body;
    try {
        const updated = await Category
            .findOneAndUpdate(
                { slug: req.params.slug },
                { name: name, slug: slugify(name) },
                { new: true }
            );
        res.json(updated);
    } catch (err) {
        res.status(400).send("Category update failed");
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Category
            .findOneAndDelete({ slug: req.params.slug });
        res.json(deleted);
    } catch (err) {
        res.status(400).send("Category delete failed");
    }
};

exports.getSubs = (req, res) => {
    Sub
        .find({ parent: req.params._id })
        .exec((err, subs) => {
            if (err) console.log(err);
            res.json(subs);
        });
};