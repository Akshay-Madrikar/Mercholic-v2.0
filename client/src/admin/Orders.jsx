import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Layout from '../core/Layout.component';
import { API } from '../config';
import { isAuthenticated } from '../utils';

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);

    const {user, token} = isAuthenticated();
    
    const loadOrders = async (userId, token) => {
        try {
            const orders = await fetch(`${API}/order/list/${userId}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const ordersJSON = await orders.json();
            if(ordersJSON.error) {
                console.log(ordersJSON.error)
            } else {
                setOrders(ordersJSON);
            }
        } catch(error) {
            console.log(error);
        } 
    };

    const loadOrderStatusValues = async (userId, token) => {
        try {
            const values = await fetch(`${API}/order/status-values/${userId}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const valuesJSON = await values.json();
            if(valuesJSON.error) {
                console.log(valuesJSON.error)
            } else {
                setStatusValues(valuesJSON);
            }
        } catch(error) {
            console.log(error);
        } 
    };

    const updateOrderStatus = async (userId, token, orderId, status) => {
        try {
            const orderStatus = await fetch(`${API}/order/${orderId}/status/${userId}`, {
                method: "PUT",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status, orderId })
            });
            const orderStatusJSON = await orderStatus.json();
            if(orderStatusJSON.error) {
                console.log('Order status update failed',orderStatusJSON.error)
            } else {
                loadOrders(user._id, token);
            }
        } catch(error) {
            console.log(error);
        } 
    };

    useEffect(() => {
        loadOrders(user._id, token);
        loadOrderStatusValues(user._id, token);
    }, []);

    const showOrders = () => {
        if(orders.length > 0) {
            return (
                <h1 className="text-info display-2">
                    Total Orders: {orders.length}
                </h1>
            );
        } else {
            return <h1 className="text-danger">No orders</h1>
        }
    };

    const showInput = (key, value) => (
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text">{key}</div>
            </div>
            
            <input 
                type="text"
                value={value}
                className="form-control"
                readOnly
            />
        </div>
    );

    const handleStatusChange = (event, orderId) => {
        updateOrderStatus(user._id, token, orderId, event.target.value);
    };

    const showStatus = (order) => (
        <div className="formgroup">
            <h3 className="mark mb-4">Status: {order.status}</h3>
            <select className="fomr-control" onChange={(event) => handleStatusChange(event, order._id)}>
                <option>Update Status</option>
                { statusValues.map((status, index) => (
                    <option key={index} value={status}>
                        {status}
                    </option>
                )) }
            </select>
        </div>
    );

    return (
        <Layout title="Orders" description="Manage all orders" className="container-fluid">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showOrders()}
                    
                    {orders.map((order, index) => {
                        return (
                            <div 
                                className="mt-5"
                                key={index}
                                style={{borderBottom: '5px solid indigo'}}
                            >
                                <h2 className="mt-5">
                                    <span className="bg-info">
                                        Order ID: {order._id}
                                    </span>
                                </h2>

                                <ul className="list-group mb-2">
                                    <li className="list-group-item">
                                        {showStatus(order)}
                                    </li>
                                    <li className="list-group-item">
                                        Transaction ID: {order.transaction_id}
                                    </li>
                                    <li className="list-group-item">
                                        Amount: &#x20b9;{order.amount}
                                    </li>
                                    <li className="list-group-item">
                                        Ordered by: {order.user.name}
                                    </li>
                                    <li className="list-group-item">
                                        Ordered on: {moment(order.createdAt).fromNow()}
                                    </li>
                                    <li className="list-group-item">
                                        Delivery address: {order.address}
                                    </li>
                                </ul>

                                <h3 className="mt-4 mb-4 font-italic">
                                    Total products in the order: {order.products.length}
                                </h3>

                                {order.products.map((product, index) => (
                                    <div 
                                        className="mb-4" 
                                        key={index} 
                                        style={{padding: '20px', border: '1px solid indigo'}}
                                    >
                                        {showInput('Product name', product.name)}
                                        {showInput('Product price', product.price)}
                                        {showInput('Product total', product.count)}
                                        {showInput('Product Id', product._id)}
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div> 
            </div>
        </Layout>
    );
};

export default Orders;