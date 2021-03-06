import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Layout from '../core/Layout.component';
import { API } from '../config';
import { isAuthenticated } from '../utils';
import { Link } from 'react-router-dom';

const Dashboard = () => {

    const [history, setHistory] = useState([]);
    const {user: { _id, name, email, role}} = isAuthenticated();
    const token = isAuthenticated().token;
    console.log(token)

    // const init = (userId, token) => {
    //     getPurchaseHistory(userId, token)
    // }; 

    useEffect(() => {
        getPurchaseHistory(_id, token);
    }, []);

    const getPurchaseHistory = async (userId, token) => {
        try {
            const historyData = await fetch(`${API}/orders/by/user/${userId}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const historyDataJSON = await historyData.json();
            if(historyDataJSON.error) {
                console.log(historyDataJSON.error);
            } else {
                setHistory(historyDataJSON);
            };
        } catch(error) {
            console.log(error);
        } 
    };

    const userLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">User Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/cart">My Cart</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to={`/profile/${_id}`}>Update Profile</Link>
                    </li>
                </ul>
            </div>
        );
    };

    const userInfo = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">{role === 1 ? 'Admin' : 'Registered User'}</li>
                </ul>
            </div>
        );
    };

    const purchaseHistory = (history) => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">Purchase history</h3>
                <ul className="list-group">
                    <li className="list-group-item">
                        {history.map((h, i) => {
                            return (
                                <div>
                                    <hr />
                                    <h4 className="text-secondary">Transaction ID: {h.transaction_id}</h4>
                                    <h5 className="text-info">Order Status: {h.status}</h5>
                                    { h.products.length > 1 ? 
                                        h.products.map((p, i) => {
                                            return (
                                                <div key={i}>
                                                    <h6>Product name: {p.name}</h6>
                                                    <h6>Product price: ${p.price}</h6>
                                                    <h6>
                                                        Purchased date:{" "}
                                                        {moment(p.createdAt).fromNow()}
                                                    </h6>
                                                    <hr style={{borderColor: 'blue', border: 'dashed'}}/>
                                                </div>
                                            );
                                        }) : 
                                        h.products.map((p, i) => {
                                            return (
                                                <div key={i}>
                                                    <h6>Product name: {p.name}</h6>
                                                    <h6>Product price: ${p.price}</h6>
                                                    <h6>
                                                        Purchased date:{" "}
                                                        {moment(p.createdAt).fromNow()}
                                                    </h6>
                                                </div>
                                            );
                                        })}
                                </div>
                            );
                        })}
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout
            title="Dashboard"
            description={`G'day ${name}`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">
                    {userLinks()}
                </div>
                <div className="col-9">
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div> 

           
        </Layout>
    );
};

export default Dashboard;