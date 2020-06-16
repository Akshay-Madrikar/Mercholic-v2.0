import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import moment from 'moment';
import ShowImage from './ShowImage.component';
import { addItem } from '../utils/cartHelpers';
import { useState } from 'react';

const Card = ({ product, showViewProductButton = true }) => {

    const [redirect, setRedirect] = useState(false); 

    const showViewButton = (showViewProductButton) => {
        return (
            showViewProductButton && (
                <Link to={`/product/${product._id}`}>
                    <button className="btn btn-outline-primary mt-2 mb-2 mr-2">
                        View Product
                    </button>
                </Link>
            )
        );
    };

    const addToCart = () => {
        addItem(product, () => {
            setRedirect(true);
        });
    };

    const showRedirect = (redirect) => {
        if(redirect) {
            return <Redirect to="/cart"/>
        }
    }

    const showAddToCartButton = () => {
        return (
            <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">
                Add To Cart
            </button>
        );
    };

    const showStock = (quantity) => {
        return quantity > 0 ? (
            <span className="badge badge-primary badge-pill">In Stock</span>
        ) : (
            <span className="badge badge-primary badge-pill">Out of Stock</span>
        )
    };

    return (
            <div className="card">
                <div className="card-header name">{product.name}</div>
                <div className="card-body">
                    {showRedirect(redirect)}
                    <ShowImage item={product} url="product"/>
                    <p className="lead mt-2">
                        {product.description}
                    </p>
                    <p className="black-10">
                        &#x20b9;{product.price}
                    </p>
                    <p className="black-9">
                        Category: {product.category && product.category.name}
                    </p>
                    <p className="black-8">
                        Added on {moment(product.createdAt).fromNow()}
                    </p>

                    {showStock(product.quantity)}
                    <br/>

                    {showViewButton(showViewProductButton)}

                    {showAddToCartButton()}
                </div>
            </div>
    );
};

export default Card;