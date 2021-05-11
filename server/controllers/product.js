const Product = require('../models/product');
const User = require('../models/user');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        // res.status(400).send('Create product failed');
        res.status(400).json({
            err: err.message,
        });
    }
};

exports.listAll = async (req, res) => {
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate('category')
        .populate('subs')
        .sort([['createdAt', 'desc']])
        .exec();
    res.json(products);
};

exports.remove = async (req, res) => {
    try {
        const deleted = await (await Product.findOneAndRemove({ slug: req.params.slug })).execPopulate();
        res.json(deleted);
    } catch (err) {
        console.log(err);
        return res.status(400).send('Product delete failed');
    }
};

exports.read = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
        .populate("category")
        .populate("subs")
        .exec();
    res.json(product);
};

exports.update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updated = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        ).exec();
        res.json(updated);
    } catch (err) {
        console.log('PRODUCT UPDATE ERROR --------->', err);
        // return res.status(400).send('Product update failed');
        res.status(400).json({
            err: err.message,
        });
    }
};


// WITHOUT PAGINATION
// exports.list = async (req, res) => {
//     try {
//         // createdAt/updatedAt, desc/asc, 3
//         const {sort, order, limit} = req.body;
//         const products = await Product.find({})
//         .populate('category')
//         .populate('subs')
//         .sort([[sort, order]])
//         .limit(limit)
//         .exec();

//         res.json(products);
//     } catch (err) {
//         console.log(err);
//     }
// };

// ** WITH PAGINATION
exports.list = async (req, res) => {
    // console.table(req.boy);
    try {
        // createdAt/updatedAt, desc/asc, 6
        const { sort, order, page } = req.body;
        const currentPage = page || 1;
        const perPage = 6;

        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate('category')
            .populate('subs')
            .sort([[sort, order]])
            .limit(perPage)
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
};

exports.productStar = async (req, res) => {
    //* find the product
    const product = await (await Product.findById(req.params.productId)).execPopulate();
    //* by this user
    const user = await User.findOne({ email: req.user.email }).exec();
    //* star rating is received here from the front end. 1-2-3-4-5
    const { star } = req.body;

    //? who is updating?
    //? check if currently logged in user have already added rating to this product?
    /* In existingRatingObject, each product will have an array of ratings. Using the
    find method, the code will run through each element that is postedBy which must
    match the logged in user's id.  This result will be the existingRatingObject that
    we need. Now we can access the star rating within existingRatingObject and use that
    to populate this state in client side Product.js useEffect() callback */
    let existingRatingObject = product.ratings.find(
        (ele) => (ele.postedBy.toString() === user._id.toString()));

    //? if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
        //? if existingRatingObject is undefined, going to post a brand new rating to the ratings array */
        let ratingAdded = await Product.findByIdAndUpdate(product._id, {
            $push: { ratings: { star: star, postedBy: user._id } },
            /* use new: true when you want to send this 
            newly updated information to the front end */
        }, { new: true }).exec();
        console.log("ratingAdded", ratingAdded);
        res.json(ratingAdded);
    } else {
        //? if user have already left rating, update it
        const ratingUpdated = await Product.updateOne(
            // using elemMatch find the exact existingRatingObject
            { ratings: { $elemMatch: existingRatingObject }, },
            // update the style value using set method
            { $set: { "ratings.$.star": star } },
            { new: true }
        ).exec();
        console.log('ratingUpdated', ratingUpdated);
        // then simply send a json response
        res.json(ratingUpdated);
    }

};

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();

    /* Going to use more then one expression into the find method whenever
    the code needs to make some queries. This will find this products 
    category based on the const product above, but not including ($ne) 
    this product itself. To accomplish that it will contain the value of 
    the product._id. */
    const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
    })
        .limit(6)
        .populate('category')
        .populate('subs')
        .populate('postedBy')
        .exec();

    res.json(related);
};

// ** search / filters
/* HandleQuery will query the database and give the response as a JSON response.
Here the code receives req, res, query as an argument passed on by searchFilters.*/
const handleQuery = async (req, res, query) => {
    /* Using the Product Model, use  the find method. Find based on text with 
    special method that is used for mongoose. In the product.js model, the text is 
    set to true. The reason is that the code needs to be able to query the text that 
    is sent. So, in the $text, the code will search in the database ($search), based
    on the query. This is known as text based search. */
    const products = await Product.find({ $text: { $search: query } })
        /* now populate the needed items, selecting certain values. So, if any of the user $text
        is found in the title or description, Those products will be sent back as a JSON response.*/
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
    /* So if the user texts is found during the query, the response is a JSON of products.*/
    res.json(products);
};

const handlePrice = async (req, res, price) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({ category })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const handleStar = (req, res, stars) => {
    //* Utilizing $project (aggregation)
    Product.aggregate([
        {
            $project: {
                document: "$$ROOT",
                // title: "$title",
                floorAverage: {
                    $floor: { $avg: "$ratings.star" },
                },
            },
        },
        { $match: { floorAverage: stars } },
    ])
        .limit(12)
        .exec((err, aggregates) => {
            if (err) console.log('AGGREGATE ERROR', err);
            Product.find({ _id: aggregates })
                .populate('category', '_id name')
                .populate('subs', '_id name')
                .populate('postedBy', '_id name')
                .exec((err, products) => {
                    if (err) console.log('PRODUCT AGGREGATE ERROR ', err);
                    res.json(products);
                });
        });

};

const handleSub = async (req, res, sub) => {
    const products = await Product.find({ subs: sub })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
};

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({ shipping })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
}

const handleBrand = async (req, res, brand) => {
    const products = await Product.find({ brand })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
}

// const handleColor = async (req, res, color) => {
//     const products = await Product.find({ color })
//         .populate('category', '_id name')
//         .populate('subs', '_id name')
//         .populate('postedBy', '_id name')
//         .exec();

//     res.json(products);
// }

exports.searchFilters = async (req, res) => {
    /* From the feature in the frontend that sends the search query, 
    to implement this search feature, the code needs to access the 
    query which is sent in the req.body. 
    Side Note: The word query could had been named anything, in this 
    case the word that was picked in query. */
    const { query, price, category, stars, sub, shipping } = req.body; //, color, brand
    //? If the code receives a request for a query, 
    /*  The code must now perform the search query. To accomplish this, the code 
    utilizes another helper method. Why is a handleQuery needed, because the user
    may ask for a price query, or a category query, or a rating query, ect. */
    if (query) {
        console.log('query', query);
        await handleQuery(req, res, query);
    };
    //* price will be coming in an array, two numbers and the price is in between.
    if (price !== undefined) {
        console.log('price ----->', price);
        await handlePrice(req, res, price)
    }

    if (category) {
        console.log('category ------>', category);
        await handleCategory(req, res, category);
    }

    if (stars) {
        console.log('stars ----->', stars);
        await handleStar(req, res, stars);
    }

    if (sub) {
        console.log('sub ----->', sub);
        await handleSub(req, res, sub);
    }

    if (shipping) {
        console.log("shipping------->", shipping);
        await handleShipping(req, res, shipping);
    }

    // if (color) {
    //     console.log("color------->", color);
    //     await handleColor(req, res, color);
    // }

    // if (brand) {
    //     console.log("brand------->", brand);
    //     await handleBrand(req, res, brand);
    // }
};