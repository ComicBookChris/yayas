const express = require('express');

const router = express.Router();

//* middlewares
const { authCheck } = require('../middlewares/auth');

//* controllers
const {
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    //!
    // getSaveAddress,
    applyCouponToUserCart,// coupon
    createOrder,
    orders,
    addToWishlist,
    wishlist,
    removeFromWishlist,
    getUsers
} = require('../controllers/user');

router.post('/user/cart', authCheck, userCart); // save cart
router.get('/user/cart', authCheck, getUserCart); // get cart
router.delete('/user/cart', authCheck, emptyCart); // empty cart
router.post('/user/address', authCheck, saveAddress); //
router.post('/user/order', authCheck, createOrder);


router.get('/user/orders', authCheck, orders);


// coupon
router.post('/user/cart/coupon', authCheck, applyCouponToUserCart);

// wishlist // addToWishlist, wishlist, removeFromWishlist
router.post("/user/wishlist", authCheck, addToWishlist);
// wishlist is a function in the controller that is in all lowercase in this get
router.get('/user/wishlist', authCheck, wishlist);
// this put is for update
router.put('/user/wishlist/:productId', authCheck, removeFromWishlist);

//* router.get('/user', (req, res) =>{
//*     res.json({
//*         data: "hey you hit user API endpoint",
//*     });
//* });

// Route for getting all users
router.get('/user', authCheck, getUsers);

module.exports = router;
