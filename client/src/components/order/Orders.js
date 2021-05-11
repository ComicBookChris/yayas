import React, { useState, useEffect, useSelector } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ShowPaymentInfo from '../cards/ShowPaymentInfo';
import { getUsers } from '../../functions/user';

const Orders = ({ orders, handleStatusChange, token }) => {
    const [users, setUsers] = useState([]);

    const _getUsers = () =>
        getUsers(token).then((res) => {
            console.log(res.data);
            setUsers(res.data);
        });

    useEffect(() => {
        _getUsers();
    }, []);

    const showOrderInTable = (order) => (
        
        <table className='table table-bordered' >
            <thead className='thead-light'>
                <tr>
                    <th scope='col' >Title</th>
                    <th scope='col' >Price</th>
                    <th scope='col' >Count</th>
                    {/* <th scope='col' >Brand</th> */}
                    {/* <th scope='col' >Color</th> */}
                    <th scope='col' >Shipping</th>
                </tr>
            </thead>

            <tbody>
                {order.products.map((p, i) => (
                    <tr key={i} >
                        <td><b>{p.product.title}</b></td>
                        <td>{p.product.price}</td>
                        {/* <td>{p.product.brand}</td> */}
                        {/* <td>{p.color}</td> */}
                        <td>{p.count}</td>
                        <td>
                            {p.product.shipping === 'Yes'
                                ? (<CheckCircleOutlined style={{ color: 'green' }} />)
                                : (<CloseCircleOutlined style={{ color: 'red' }} />)
                            }
                        </td>
                    </tr>
                ))}
            </tbody>

        </table>
    );

    console.log(users);
    console.log(orders);

    const findUserById = function (_id) {
        for (var x = 0; x < users.length; x = x + 1) {
            const user = users[x];
            console.log(`This is the id passed into the function: ${_id}`)
            if (_id === user._id.toLowerCase()) {
                console.log(`Match between: ${_id} and ${user._id.toLowerCase()}`);
                return user;
            }
        }
        console.log(`Couldn't find match for: ${_id}.`);
        return null;
    }

    return (
        <>
            {orders.map((order) => (
                <div key={order._id} className="row pb-5">
                    <div className="btn btn-block bg-light">
                        <ShowPaymentInfo order={order} showStatus={false} />
                        {/* TODO Add null check for User object. */}
                        <div className="admin-dashboard">
                        <p className="text-danger">Name: {JSON.stringify(findUserById(order.orderBy).name)}</p>
                        <p className="text-info">Email: {JSON.stringify(findUserById(order.orderBy).email)}</p>
                        <p className="text-success">Address: {JSON.stringify(findUserById(order.orderBy).address)}</p>
                        <br />
                        </div>
                        <div className="row">
                            <div className="col-md-4">Delivery Status</div>

                            <div className="col-md-8">
                                <select
                                    onChange={e => handleStatusChange(order._id, e.target.value)}
                                    className="form-control"
                                    defaultValue={order.orderStatus}
                                    name="status"
                                >
                                    <option value="Not Processed">Not Processed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Dispatched">Dispatched</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {showOrderInTable(order)}
                </div>
            ))}
        </>
    )
}
export default Orders;