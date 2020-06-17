import React from 'react';
import { isAuthenticated } from '../utils/index'
import { Link } from 'react-router-dom';

const Checkout = ({products}) => {
    
    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    };

    const showCheckout = () => {
        return (
             isAuthenticated() ? (
                <button className="btn btn-success">Checkout</button>
            ) : (
                <Link to="/signin">
                    <button className="btn btn-primary">Sign in to Checkout</button>
                </Link>
            )
        );
    };

    return (
        <div>
            <h2>Total : &#x20b9;{getTotal()}</h2>

            {showCheckout()}
        </div>
    );
};

export default Checkout;