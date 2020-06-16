import React, { useState, useEffect } from 'react';
import Layout from './Layout.component';
import { API } from '../config';
import { getCart, itemTotal } from '../utils/cartHelpers';
import Card from './Card.component';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [items, setItems] = useState([]); 

    useEffect(() => {
        setItems(getCart());
    }, []);

    const showItems = (items) => {
        return (
            <div>
                <h2>Your cart has {`${items.length}`} items</h2>
                <hr/>
                {items.map((product, index) => (
                    <Card key={index} product={product}/>
                ))}
            </div>
        );
    };

    const showEmptyMessage = () => (
        <h2>
            Your cart is empty. <br/>
            <Link to="/shop">Continue shopping...</Link>
        </h2>
    )

    return (
        <Layout title="Shopping Cart" description="Manage your cart items and continue shopping..." className="container-fluid">
            <div className="row">
                <div className="col-6">
                    { items.length > 0 ? showItems(items) : showEmptyMessage() }
                </div>

                <div className="col-6">
                    <p>Show checkout options</p>
                </div>
            </div>
        </Layout>
    );
};

export default Cart;