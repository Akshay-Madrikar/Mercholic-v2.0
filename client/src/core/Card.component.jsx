import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import moment from 'moment';
import ShowImage from './ShowImage.component';
import { addItem, updateItem, removeItem } from '../utils/cartHelpers';
import { useState } from 'react';

const Card = ({ 
        product, 
        showDetails = true, 
        showViewProductButton = true, 
        showAddToCartButton = true,
        cartUpdate = false,
        showRemoveProductButton = false,
        setRun = f => f,
        run = undefined
    }) => {

    const [redirect, setRedirect] = useState(false); 
    const [count, setCount] = useState(product.count); 

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
            if(product.quantity >= 1){
                setRedirect(true);
            } else {
                alert('Product out of stock! Grab it while in stock :)');
            }
        });
    };

    const showRedirect = (redirect) => {
        if(redirect) {
            return <Redirect to="/cart"/>
        }
    };

    const showProductDetails = (showDetails) => {
        return ( showDetails && (
            <>
            <p className="black-9">
                Category: {product.category && product.category.name}
            </p>
            <p className="black-8">
                Added on {moment(product.createdAt).fromNow()}
            </p>
            {showStock(product.quantity)}
            <br/>
            </>
        ))
    }

    const showAddToCart = (showAddToCartButton) => {
        return ( showAddToCartButton && (
            <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">
                Add To Cart
            </button>
        ));
    };

    const showRemove = (showRemoveProductButton) => {
        return ( showRemoveProductButton && (
            <button 
                onClick={() => {
                    removeItem(product._id);
                    setRun(!run);
                }} 
                className="btn btn-outline-danger mt-2 mb-2">
                Remove Product
            </button>
        ));
    };

    const showStock = (quantity) => {
        return quantity > 0 ? (
            <span className="badge badge-primary badge-pill">In Stock</span>
        ) : (
            <span className="badge badge-primary badge-pill">Out of Stock</span>
        )
    };

    const handleChange = (productId) => (event) => {
        setRun(!run);
        setCount(event.target.value < 1 ? 1 : event.target.value);

        if(event.target.value >= 1) {
            updateItem(productId, event.target.value)
        };
    };

    const showCartUpdateOptions = (cartUpdate) => {
        return cartUpdate && (
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">Adjust Quantity</span>
                </div>    
                <input 
                    type="number" 
                    className="form-control" 
                    value={count} 
                    onChange={handleChange(product._id)}
                />
            </div>
        );
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
                    {showProductDetails(showDetails)}

                    {showViewButton(showViewProductButton)}

                    {showAddToCart(showAddToCartButton)}

                    {showRemove(showRemoveProductButton)}

                    {showCartUpdateOptions(cartUpdate)}
                </div>
            </div>
    );
};

export default Card;