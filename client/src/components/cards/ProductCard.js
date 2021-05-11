import './cards.css';
import React, { useState } from 'react';
import { Card, Tooltip } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Yayas from '../../images/yayas.png';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { showAverage } from '../../functions/rating';
import _ from 'lodash';
//* useSelector is to access redux, useDispatch is to update redux
import { useSelector, useDispatch } from 'react-redux';

const { Meta } = Card;

const ProductCard = ({ product }) => {

    const [tooltip, setTooltip] = useState('Click to add');

    //redux
    const { user, cart } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

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

    // destructure
    const { images, title, description, slug, price } = product;

    return (
        <div className="container-fluid product-card">

            <div className='pt-5 text-center text-primary'>$ {product && product.title && price}</div>
            <div className='text-center text-primary'>{`${description && description.substring(0, 40)}...`}</div>
            {product && product.ratings && product.ratings.length > 0
                ? showAverage(product)
                : <div className='text-center pt-1 pb-3'>No rating yet</div>}
            <Card

                cover={
                    <img alt="Product Image" src={
                        images && images.length
                            ? images[0].url
                            : Yayas
                    }
                        style={{ height: "150px", objectFit: "cover" }}
                        className="p-1"
                    />
                }

                actions={[
                    <Link to={`/product/${slug}`}>
                        <EyeOutlined className="text-warning" />
                        <br /> View Product
                    </Link>,
                    <Tooltip title={tooltip}>
                        <a
                            onClick={handleAddToCart}
                            disabled={product.quantity < 1 || product.shipping === "No"}
                            // disabled={}
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
                ]}
            >
                <Meta
                    title={`${title} - ${price}`}
                    description={`${description && description.substring(0, 40)}...`}
                />
            </Card>
        </div>
    )
};

export default ProductCard;