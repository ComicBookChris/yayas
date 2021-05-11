const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');
const Order = require('../models/order');

//* userCart
exports.userCart = async (req, res) => {
    // console.log(req.body); // {cart: []}
    const { cart } = req.body;

    let products = [];

    const user = await User.findOne({ email: req.user.email }).exec();

    // check if cart with logged in user id already exist
    let cartExistByThisUser = await Cart.findOne({ orderBy: user._id }).exec();

    if (cartExistByThisUser) {
        cartExistByThisUser.remove();
        console.log("removed old cart");
    }

    for (let i = 0; i < cart.length; i++) {
        let object = {};

        object.product = cart[i]._id;
        object.count = cart[i].count;
        // object.color = cart[i].color;
        //get price for creating total
        let productFromDb = await Product.findById(cart[i]._id)
            .select("price")
            .exec();
        object.price = productFromDb.price;

        products.push(object);
    }

    // console.log('products', products);

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count;
    }

    // console.log("cartTotal", cartTotal);

    let newCart = await new Cart({
        products,
        cartTotal,
        orderBy: user._id,
    }).save();

    console.log('new cart ----->', newCart);
    res.json({ ok: true });
};
//* getUserCart
exports.getUserCart = async (req, res) => {
    const user = await User
        .findOne({ email: req.user.email })
        .exec();

    let cart = await Cart
        .findOne({ orderBy: user._id })
        .populate('products.product', '_id title price totalAfterDiscount')
        .exec();

    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({ products, cartTotal, totalAfterDiscount });
};
//* emptyCart
exports.emptyCart = async (req, res) => {
    console.log("empty cart");
    const user = await User
        .findOne({ email: req.user.email })
        .exec();

    const cart = await Cart
        .findOneAndRemove({ orderBy: user._id })
        .exec();
    res.json(cart);
};
//* saveAddress
exports.saveAddress = async (req, res) => {
    const userAddress = await User
        .findOneAndUpdate({ email: req.user.email }, { address: req.body.address })
        .exec();

    res.json({ ok: true });
};

//! should getSaveAddress go here?

//* applyCouponToUserCart
exports.applyCouponToUserCart = async (req, res) => {
    const { coupon } = req.body;
    console.log('COUPON', coupon);

    const validCoupon = await Coupon
        .findOne({ name: coupon })
        .exec();
    if (validCoupon === null) {
        return res.json({
            err: 'Invalid coupon',
        });
    }

    console.log('VALID COUPON', validCoupon);

    const user = await User
        .findOne({ email: req.user.email })
        .exec();

    let { products, cartTotal } = await Cart
        .findOne({ orderBy: user._id })
        .populate('products.product', '_id title price')
        .exec();

    console.log('cartTotal', cartTotal, 'discount%', validCoupon.discount);

    // calculate total after discount
    let totalAfterDiscount = (
        cartTotal - (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    console.log('--------->', totalAfterDiscount);

    Cart.findOneAndUpdate(
        { orderBy: user._id },
        { totalAfterDiscount },
        { new: true }
    ).exec();

    res.json(totalAfterDiscount);
};
//* createOrder
exports.createOrder = async (req, res) => {
    // console.log(req.body);
    // return;

    const { paymentIntent } = req.body.stripeResponse;

    const user = await User.findOne({ email: req.user.email }).exec();
    let { products } = await Cart.findOne({ orderBy: user._id }).exec();



    let newOrder = await new Order({
        products,
        paymentIntent,
        orderBy: user._id,
    }).save();
    console.log('NEW ORDER SAVED', newOrder);
    res.json({ ok: true });

    // decrement quantity, increment sold
    let bulkOption = products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id }, // IMPORTANT item.product
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });

    let updated = await Product.bulkWrite(bulkOption, {});
    console.log('PRODUCT QUANTITY -- AND SOLD++', updated);

    console.log('New Order Saved', newOrder),
        res.json({ ok: true });
};
//* Orders
exports.orders = async (req, res) => {
    let user = await User.findOne({ email: req.user.email }).exec();

    let userOrders = await Order.find({ orderBy: user._id }).populate('products.product').exec();

    res.json(userOrders);
};

//* addToWishlist
exports.addToWishlist = async (req, res) => {
    const { productId } = req.body;

    const user = await User.findOneAndUpdate(
        { email: req.user.email },
        { $addToSet: { wishlist: productId } }
    ).exec();

    res.json({ ok: true });
};

//* wishlist
exports.wishlist = async (req, res) => {
    const list = await User.findOne({ email: req.user.email })
        .select("wishlist")
        .populate("wishlist")
        .exec();

    res.json(list);
};

//*  removeFromWishlist
exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    const user = await User.findOneAndUpdate(
        { email: req.user.email },
        { $pull: { wishlist: productId } }
    ).exec();

    res.json({ ok: true });
};

//! Endpoint for getting the user's address by _id
exports.getUsers = async (req, res) => {
    const { userId } = req.params;
    const users = await User.find().exec();

    res.json(users);
};