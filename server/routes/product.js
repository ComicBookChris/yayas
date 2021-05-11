const express = require('express');

const router = express.Router();

//*middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

//*controller
const {
    create,
    listAll,
    remove,
    read,
    update,
    list,
    productsCount,
    productStar,
    listRelated,
    searchFilters,
} = require("../controllers/product");

//*routes
router.post('/product', authCheck, adminCheck, create);
router.get('/products/total', productsCount);

router.get('/products/:count', listAll);
router.delete('/product/:slug', authCheck, adminCheck, remove);
router.get('/product/:slug', read);
router.put('/product/:slug', authCheck, adminCheck, update);

router.post('/products', list);
router.get('/products/total', productsCount);

//* rating 
/* Here the productId is accessed from the req.params, 
for productStar the work is done in the controller method */
router.put('/product/star/:productId', authCheck, productStar);

//* related
router.get('/product/related/:productId', listRelated);

//* Endpoint for search 
/* Why post and not get, because with post
it will be very easy to send the additional parameters. So
the request is made to this endpoint, and the query is sent from the 
req.body in searchFilters in product.js controllers. And based on that, 
after getting the query, using the method handleQuery in product.js controllers
to query to database, it will send a JSON response to the frontend.  */
router.post('/search/filters', searchFilters);


module.exports = router;