const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        // required: true
    },
    email: {
        type: String,
        required: true,
        // unique: true,
        index: true,
    },
    role: {
        type: String,
        default: 'subscriber',
    },
    cart: {
        type: Array,
        default: [],
    },
    address: String, 
    // wishlist is part of the userSchema, without
    // it the data can not be saved
    wishlist: [{type: ObjectId, ref: "Product"}],
}, 
{timestamps: true}
);

module.exports = mongoose.model('User', userSchema);