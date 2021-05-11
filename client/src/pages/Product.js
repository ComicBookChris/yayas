import React, { useEffect, useState } from 'react';
import { getProduct, getRelated, productStar } from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import { useSelector } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';

const Product = ({ match }) => {
    const [product, setProduct] = useState({});
    const [related, setRelated] = useState([]);
    /* state for star and by default it will 
    have the value of zero. Now pass star as props
    in SingleProduct below, so it can be a value in 
    state. */
    const [star, setStar] = useState(0);
    // redux
    const { user } = useSelector((state) => ({ ...state }));

    const { slug } = match.params;

    useEffect(() => {
        loadSingleProduct();
    }, [slug]);

    useEffect(() => {
        if (product.ratings && user) {
            let existingRatingObject = product.ratings.find(
                /* If any of these elements postedBy match this user from the redux.
                That means we have existingRatingObject for that user. */
                (ele) => (ele.postedBy.toString() === user._id.toString()));
            /* Now that we have existingRatingObject, the code will extract the 
            star value and populate the state. */
            existingRatingObject && setStar(existingRatingObject.star); // current user star
        }
    });

    const loadSingleProduct = () => {
        getProduct(slug).then((res) => {
            setProduct(res.data);
            // load related
            getRelated(res.data._id).then(res => setRelated(res.data));
        });
    }


    const onStarClick = (newRating, name) => {
        /** setStar is the newRating, whatever is coming in */
        setStar(newRating);
        // console.table(newRating, name);
        /* The order of the parameters in productStar
        is very important. Order is associated with 
        productStar in the backend file called function */
        productStar(name, newRating, user.token)
            .then((res) => {
                console.log("rating clicked", res.data);
                loadSingleProduct(); // if you want to show updated rating in real time
            })
    };

    return <div className="container-fluid">
        <div className="row p-4">
            <SingleProduct
                /* These are props being passed in from this parent page. */
                product={product}
                onStarClick={onStarClick}
                star={star}
            />
        </div>
        <div className="row">
            <div className="col text-center pt-5 pb-5">
                <hr />
                <h4>Products that may interest you</h4>
                <hr />
                {/* {JSON.stringify(related)} */}
            </div>
        </div>
        <div className='row pb-5'>
            {
                related.length
                    ? related.map((r) => (
                        <div key={r._id} className='col-md-4'>
                            <ProductCard product={r} />
                        </div>))
                    : <div className='text-center'>
                        No Products Found
                </div>
            }
        </div>
    </div>
};

export default Product;