import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import { isAuthenticated } from '../utils/index';
import { API } from '../config';


const Checkout = ({products}) => {

    const [data, setData] = useState({
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
    
    const getBraintreeClientToken = async (userId, token) => {
        try {
            const clientToken = await fetch(`${API}/braintree/getToken/${userId}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const clientTokenJSON = await clientToken.json();
            if(clientTokenJSON.error) {
                setData({
                    ...data,
                    error: clientTokenJSON.error
                })
            } else {
                setData({
                    ...data,
                    clientToken: clientTokenJSON.clientToken
                });
            };
        } catch(error) {
            console.log(error);
        } 
    };

    useState(() => {
        getBraintreeClientToken(userId, token);
    }, [])

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    };

    const showCheckout = () => {
        return (
             isAuthenticated() ? (
                <div>{showDropIn()}</div>
            ) : (
                <Link to="/signin">
                    <button className="btn btn-primary">Sign in to Checkout</button>
                </Link>
            )
        );
    };

    const buy = async() => {
        try {
            // send nonce to your server
            // nonce = data.instance.requestPaymentMethod()
            const getNonce = await data.instance.requestPaymentMethod();
            // nonce(card type, card number) send as 'paymentMethodNonce' and total as amount
            let nonce = getNonce.nonce;
            // console.log(nonce, getTotal(products))
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getTotal(products)
            };

            processPayment(userId, token, paymentData);

        } catch(error) {
            console.log('Dropin Error' , error)
            setData({...data, error: error.message})
        }
    };

    const processPayment = async (userId, token, paymentData) => {
        try {
            const data = await fetch(`${API}/braintree/payment/${userId}`, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(paymentData)
            });
            const dataJSON = await data.json();
            if(dataJSON.error) {
                setData({
                    ...data,
                    error: dataJSON.error
                });
            } else {
                setData({
                    ...data, 
                    success: dataJSON.success
                });
            };
        } catch(error) {
            console.log(error);
        } 
    };

    const showDropIn = () => {
        return (
            //onBlur to remove error message on typing
            <div onBlur={() => setData({...data, error: ''})}> 
                { data.clientToken !== null && products.length > 0 ? (
                    <div>
                        <DropIn 
                            options={{ authorization: data.clientToken }}
                            onInstance={instance => ( data.instance = instance )}
                        />
                        <button className="btn btn-success btn-block" onClick={buy}>Pay</button>
                    </div>
                ) : null }
            </div>
        );
    };

    const showError = (error) => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess = (success) => (
        <div className="alert alert-info" style={{display: success ? '' : 'none'}}>
            <p>Thank You! Your payment was successful!</p>
        </div>
    );

    return (
        <div>
            <h2>Total : &#x20b9;{getTotal()}</h2>
            {showError(data.error)}
            {showSuccess(data.success)}
            {showCheckout()}
        </div>
    );
};

export default Checkout;