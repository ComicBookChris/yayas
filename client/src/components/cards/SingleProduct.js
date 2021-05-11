import React, { useState } from 'react';
import { Card, Tabs, Tooltip } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './cards.css';
import Yayas from '../../images/yayas.png';
import ProductListItems from './ProductListItems';
import StarRating from 'react-star-ratings';
import RatingModal from '../modal/RatingModal';
import { showAverage } from '../../functions/rating';
import _ from 'lodash';
import {addToWishlist} from '../../functions/user';
//* useSelector is to access redux, useDispatch is to update redux
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const { TabPane } = Tabs;

// This is children component of Product page
const SingleProduct = ({ product, onStarClick, star }) => {

    const [tooltip, setTooltip] = useState('Click to add');

    //redux
    const { user, cart } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

    // router
    let history = useHistory();

    const { title, images, description, _id } = product;

    const handleAddToCart = () => {
        // create cart array
        let cart = [];
        if (typeof window !== 'undefined') {
            // if cart is in local storage GET it
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }
            // push new product to cart
            cart.push({
                ...product,
                count: 1,
            });

            // remove duplicates
            let unique = _.uniqWith(cart, _.isEqual)

            // save to local storage
            console.log('unique', unique);
            localStorage.setItem("cart", JSON.stringify(unique));

            //show tooltip
            setTooltip('Added');

            // add to redux state
            dispatch({
                type: "ADD_TO_CART",
                payload: unique,
            });

            // show cart items inside drawer
            dispatch({
                type: "SET_VISIBLE",
                payload: true,
            });
        }
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        addToWishlist(product._id, user.token)
        .then((res) => {
            console.log("ADDED TO WISHLIST", res.data);
            toast.success("Added to wishlist");
            history.push('/user/wishlist');
        });

    };

    return (
        <>

            <div className="col-md-7">
                {images && images.length
                    ? (<Carousel showArrows={true} autoPlay infiniteLoop>
                        {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
                    </Carousel>)
                    : (<Card cover={<img src={Yayas} alt="Yayas Island Mart's Logo" className="mb-3 card-image" />}></Card>
                    )}

                <Tabs type="card">
                    <TabPane tab="Description" key="1">
                        {description && description}
                    </TabPane>
                    <TabPane tab="Learn More" key="2">
                        Please feel free to email to learn more about the product
                        </TabPane>
                </Tabs>
            </div>

            <div className="col-md-5">
                <h1 className="single-card-title p-3">{title}</h1>


                {product && product.ratings && product.ratings.length > 0
                    ? showAverage(product)
                    : <div className='text-center pt-1 pb-3'>No rating yet</div>}

                <Card
                    actions={[
                        <Tooltip title={tooltip}>
                        <a
                            onClick={handleAddToCart}
                            disabled={product.quantity < 1 || product.shipping === "No"}
                        >

                            {product.quantity < 1 && product.shipping === "Yes"
                                ? (<div><ShoppingCartOutlined style={{ color: 'red' }} /><br />Out Of Stock</div>)
                                : (null)
                            }

                            {product.shipping === "No" 
                                ? (<div><ShoppingCartOutlined style={{ color: 'orange' }} /><br />In Store Only</div>)
                                : (null)
                            }
                            {product.quantity > 1 && product.shipping === "Yes"
                                ? (<div><ShoppingCartOutlined style={{ color: 'green' }} /><br />Add To Cart</div>)
                                : (null)
                            }

                            </a>
                        </Tooltip>,
                        <a onClick={handleAddToWishlist} >
                            <HeartOutlined className="text-info" />
                            <br />
                            Add to Wishlist
                        </a>,
                        <RatingModal>
                            <StarRating
                                name={_id}
                                numberOfStars={5}
                                rating={star}
                                changeRating={onStarClick}
                                isSelectable={true}
                                isAggregateRating={true}
                                starRatedColor="rgb(255, 196, 13)"
                                starEmptyColor="rgb(203, 211, 227)"
                                starHoverColor="rgb(245, 224, 81)"
                            />
                        </RatingModal>,
                    ]}
                >
                    <ProductListItems product={product} />
                </Card>
            </div>
        </>
    );
};

export default SingleProduct;