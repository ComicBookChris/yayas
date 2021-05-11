import React from 'react'
import { Link } from 'react-router-dom';

const ProductListItems = ({ product }) => {
    const { price, category, subs, shipping, quantity, sold } = product; //color, brand, 
    return (
        <div>
            <ul className="list-group">
                <li className="list-group-item">
                    Price{""}
                    <span className="label-default label-pill pull-xs-right">
                        $ {price}
                    </span>
                </li>
                {category && (
                    <li className="list-group-item">
                        Category{" "}
                        <Link
                            /* This Link is tied to CategoryHome page */
                            to={`/category/${category.slug}`}
                            className="label label-default label-pill pull-xs-right"
                        >
                            {category.name}
                        </Link>
                    </li>
                )}

                {subs && (
                    <li className="list-group-item">
                        Sub Categories
                        {subs.map((s) =>
                            <Link
                            /* This LInk is tied to SubCategoryHome page */
                                key={s._id}
                                to={`/sub/${s.slug}`}
                                className="label-default label-pill pull-xs-right">
                                {s.name}
                            </Link>
                        )}
                    </li>
                )}

                <li className="list-group-item">
                    Shipping{""}
                    <span className="label-default label-pill pull-xs-right">
                        {shipping}
                    </span>
                </li>
                {/* <li className="list-group-item">
                    Color{""}
                    <span className="label-default label-pill pull-xs-right">
                        {color}
                    </span>
                </li> */}
                {/* <li className="list-group-item">
                    Brand{""}
                    <span className="label-default label-pill pull-xs-right">
                        {brand}
                    </span>
                </li> */}
                <li className="list-group-item">
                    Available{""}
                    <span className="label-default label-pill pull-xs-right">
                        {quantity}
                    </span>
                </li>
                <li className="list-group-item">
                    Sold{""}
                    <span className="label-default label-pill pull-xs-right">
                        {sold}
                    </span>
                </li>
            </ul>
        </div>
    )
}
export default ProductListItems;