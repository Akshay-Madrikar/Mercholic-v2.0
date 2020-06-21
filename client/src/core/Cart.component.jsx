import React, { useState, useEffect } from 'react';
import Layout from './Layout.component';
import { getCart } from '../utils/cartHelpers';
import Card from './Card.component';
import Checkout from './Checkout.component';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    useEffect(() => {
        setItems(getCart());
    }, [run]);

    const showItems = (items) => {
        return (
            <div>
                <h2>Your cart has {`${items.length}`} items</h2>
                <hr/>
                {items.map((product, index) => (
                    <Card 
                        key={index} 
                        product={product} 
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                        setRun={setRun}
                        run={run}
                    />
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
                <div className="col-6 pb-4">
                    { items.length > 0 ? showItems(items) : showEmptyMessage() }
                </div>

                <div className="col-6">
                    <h2 className="mb-4">Your Cart Summary</h2>
                    <hr />
                    <Checkout products={items} setRun={setRun} run={run}/>
                </div>
            </div>
        </Layout>
    );
};

export default Cart;