import React, { useState } from 'react';

import { Menu, Badge } from 'antd';
import {
    // HomeOutlined,
    LoginOutlined,
    UserOutlined,
    UserAddOutlined,
    LogoutOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Yayas from './yayas.png';
import './header.css';
const { SubMenu, Item } = Menu; // Menu.subMenu



const Header = () => {

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
            className="text-white"
            id="header-1"
        >
            <Item key="home" >
                <Link to="/"><img
                    src={Yayas}
                    className="home__image"
                    alt="Yayas Island Mart's Logo"
                /></Link>
            </Item>

            {!user && (
                <Item
                    key="register"
                    icon={<UserAddOutlined />}
                    className="float-right"
                >
                    <Link to="/register">Register</Link>
                </Item>
            )}

            {!user && (
                <Item
                    key="login"
                    icon={<LoginOutlined />}
                    className="float-right">
                    <Link to="/login">
                        Login
                    </Link>
                </Item>
            )
            }

            {user && (

                <SubMenu
                    icon={<UserOutlined />}
                    title={user.email && user.email.split('@')[0]}
                    className="float-right text-white sub1"
                >

                    {
                        user && user.role === 'subscriber' &&
                        <Item key="setting:1">
                            <Link to="/user/history" className="text-black">
                                Dashboard
                                </Link>
                        </Item>
                    }

                    {
                        user && user.role === 'admin' &&
                        <Item key="setting:1" > 
                            <Link to="/admin/dashboard" className="text-black">
                                Dashboard
                                </Link>
                        </Item>
                    }

                    <Item key="shop" icon={<ShoppingOutlined />} >
                        <Link to="/shop" className="text-black">
                            Shop
                        </Link>
                    </Item>

                    <Item key="cart" icon={<ShoppingCartOutlined />} >
                        <Link to="/cart" className="text-black">
                            <Badge count={cart.length} offset={[9, 0]}>
                                Cart
                            </Badge>
                        </Link>
                    </Item>



                    <Item icon={<LogoutOutlined />} onClick={logout}>
                        Logout
                    </Item>
                    
                </SubMenu>
            )}

        </Menu>

    )
};
export default Header;