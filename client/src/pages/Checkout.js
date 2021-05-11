import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { getUserCart, emptyUserCart, saveUserAddress, applyCoupon } from "../functions/user";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './checkout.css';

const Checkout = ({ history }) => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState("");
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState('');
    // discount price
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountError, setDiscountError] = useState('');

    const dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        getUserCart(user.token).then((res) => {
            console.log("user cart res", JSON.stringify(res.data, null, 4));
            setProducts(res.data.products);
            setTotal(res.data.cartTotal);
        });
    }, []);

    const emptyCart = () => {
        // remove from local storage
        if (typeof window !== 'undefined') {
            localStorage.removeItem("cart");
        }
        // remove from redux
        dispatch({
            type: "ADD_TO_CART",
            payload: [],
        });
        // remove from backend
        emptyUserCart(user.token)
            .then((res) => {
                setProducts([]);
                setTotal(0);
                setTotalAfterDiscount(0);
                setCoupon('');
                toast.success("Cart is empty. Continue shopping :) ");
            });

    };

    const saveAddressToDb = () => {
        // console.log(address);
        saveUserAddress(user.token, address).then((res) => {
            if (res.data.ok) {
                setAddressSaved(true);
                toast.success("Address saved");
            }
        });
    };

    const applyDiscountCoupon = () => {
        console.log('send coupon to backend', coupon);

        // apply Coupon
        applyCoupon(user.token, coupon)
            .then((res) => {
                console.log('RES ON COUPON APPLIED', res.data);
                if (res.data) {
                    setTotalAfterDiscount(res.data);
                    // update redux coupon applied true/false
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: true,
                    });
                }
                // error
                if (res.data.err) {
                    setDiscountError(res.data.err);
                    // update redux coupon applied true/false
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: false,
                    });
                }
            });
    };

    const showAddress = () => (
        <>
            <ReactQuill
                theme='snow'
                value={address}
                onChange={setAddress}
                placeholder='Please enter full address'
            />
            <button
                className="btn btn-primary mt-2"
                onClick={saveAddressToDb}
            >
                Save
                </button>
        </>);
    //! took out ({p.color}) from p tag equation below, code seems to work fine

    const showProductSummary = () =>

        products.map((p, i) => (
            <div className="pl-3" key={i}>
                <p>{p.product.title} x {p.count} = ${Math.round(p.product.price * p.count).toFixed(2)} </p>
            </div>
        ));

    const showApplyCoupon = () => (
        <>
            <input
                placeholder='Enter coupon here'
                onChange={(e) => {
                    setCoupon(e.target.value);
                    setDiscountError('');
                }}
                value={coupon}
                type='text'
                className="form-control pl-3" />
            <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">Apply</button>
        </>
    );

    let shipmentCost = 20;

    return (
        <>
            <div className="row ">
                <div className="col-md-6">
                    <h4 className="text-center">Delivery Address</h4>
                    <p className="text-center text-success">All items will be delivered to your most recent address</p>
                    <br />
                    {showAddress()}
                    <hr />
                    <h4 className="text-center">Got Coupon?</h4>
                    <p className="text-center text-success">Coupon codes are between 6-12 characters</p>
                    <br />
                    {showApplyCoupon()}
                    <br />
                    {discountError && <p className="bg-danger p-2">{discountError}</p>}
                </div>

                <div className="col-6">
                    <h4 className="text-center">Order Summary</h4>
                    {/* {JSON.stringify(products)} */}
                    <hr />
                    <p className="pl-3">Products {products.length}</p>
                    <hr />
                    {showProductSummary()}
                    <hr />
                    <p className="text-info pl-3">A total of $20 is added for shipment cost</p>
                    <p className="pl-3">Cart Total: ${Math.round(total + shipmentCost).toFixed(2)}</p>

                    {totalAfterDiscount > 0 && (
                        <p className="bg-success p-2">Total After Discount: $ {totalAfterDiscount}</p>
                    )}

                    <div className="row">
                        <div className="col-md-6">
                            <button
                                className="btn btn-primary"
                                disabled={!addressSaved || !products.length}
                                onClick={() => history.push('/payment')}
                            >
                                Place Order
                    </button>
                        </div>
                        <div className="col-md-6">
                            <button
                                disabled={!products.length}
                                onClick={emptyCart}
                                className="btn btn-primary"
                            >
                                Empty Cart
                    </button>
                        </div>
                    </div>
                    <p className="text-left text-danger pl-3">By placing this order with Yayas Island Mart,</p>
                    <p className="text-left text-danger pl-3">you agree to Yayas Island Mart's User Agreement</p>
                    <button className="btn btn-primary">
                        <Link to={{
                            pathname: "/user-agreement",
                        }}>
                            User Agreement
                            </Link>
                    </button>
                </div>

            </div>
        </>
    )
}
export default Checkout;