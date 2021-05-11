import React, { useState } from 'react';
import { Menu, Badge } from 'antd';
import {
    // HomeOutlined,
    // LoginOutlined,
    // UserOutlined,
    // UserAddOutlined,
    // LogoutOutlined,
    // ShoppingOutlined,
    // ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import Yayas from './yayas.png';
import './footer.css';
const { SubMenu, Item } = Menu; // Menu.subMenu



const Footer = () => {

    const [current, setCurrent] = useState('home');
    let dispatch = useDispatch();
    let { user, cart } = useSelector((state) => ({ ...state }));
    let history = useHistory();

    const handleClick = (e) => {
        // console.log(e.key);
        setCurrent(e.key);
    };

    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type: "LOGOUT",
            payload: null,
        });
        history.push("/login");
    };

    return (
        <Menu
            onClick={handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            className="text-white pt-6"
            id="footer-1"
        >
            <Item key="about" >
                <Link to="/about">About</Link>
            </Item>

            <Item key="user-agreement" className="text-white" >
                <Link to="/user-agreement">User Agreement</Link>
            </Item>

            <Item key="contact-us" className="text-white" >
                <Link to="/contact-us">Contact Us</Link>
            </Item>

        </Menu>

    )
};
export default Footer;