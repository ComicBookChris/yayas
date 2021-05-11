import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FormOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';

/* When this component wraps StarRating in SingleProduct.js
The entire content in that wrap is given to this component as 
 children props */
const RatingModal = ({ children }) => {
    /* Deconstruct user from useSelector, useSelector takes a function.
    The function wants to access the state. Don't want all the state, 
    so spread the state to just access the user. */
    const { user } = useSelector((state) => ({ ...state }));
    /* modalVisible is used to control the visibility of the modal, 
    when to show, when to hide. When visible is false, it is hidden */
    const [modalVisible, setModalVisible] = useState(false);
    /* useHistory is used so that handleModal has access to history. */
    let history = useHistory();
    /* Deconstructed slug from params to be used in the 
    constant handleModal */
    let { slug } = useParams();

    // console.log('slug', slug);

    /* In handleModal, first check if the user is present. 
    The visibility will be contingent if a user is present.
    If no user present, takes the new user to the login page*/
    const handleModal = () => {
        if (user && user.token) {
            setModalVisible(true);
        } else {
            history.push({
                /* The method below will push to the login page
                but, once login has occurred, the user will
                be pushed back to its original state. This state will
                be tied into constant roleBasedRedirect in Login.js 
                under pages/auth */
                pathname: '/login',
                /* this state is from react-redux */
                state: { from: `/product/${slug}` }
            });
        }
    };
    /* return the modal, and the modal's content will be the 
    children's props, which will be the actual StarRating */
    return (
        <>
            <div onClick={handleModal}>
                <FormOutlined className="text-danger" />
                <br />{" "}
                {user ? "Leave rating" : "Login to leave rating"}
            </div>
            <Modal
                title="Leave your rating"
                centered
                visible={modalVisible}
                onOk={() => {
                    setModalVisible(false);
                    toast.success("Thanks for your review. It will show soon");
                }}
                onCancel={() => setModalVisible(false)}
            >{children}</Modal>
        </>
    );
};

export default RatingModal;