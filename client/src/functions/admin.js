import axios from "axios";

export const getOrders = async (authtoken) =>
    await axios.get(`${process.env.REACT_APP_API}/admin/orders`, {
        headers: {
            authtoken,
        },
    });

export const changeStatus = async (orderId, orderStatus, authtoken) =>
    await axios.put(
        `${process.env.REACT_APP_API}/admin/order-status`,
        { orderId, orderStatus },
        {
            headers: {
                authtoken,
            },
        }
    );

//! I am trying to get the userinfo
// export const getUserInfo = async (authtoken) =>
//     await axios.get(`${process.env.REACT_APP_API}/admin/userInfo`, {
//         headers: {
//             authtoken,
//         },
//     }); //!