import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { removeToken, isAuthenticated } from '../utils/index';
import { API } from '../config';
import { itemTotal } from '../utils/cartHelpers';

const isActive = (history, path) => {
    if(history.location.pathname === path) {
        return { color: '#ff9900' }
    } else {
        return { color: '#ffffff' }
    }
};

const Menu = ({ history }) => {

    const signOut = async () => {
        try {
            const data = await fetch(`${API}/signout`, {
                method: "GET"
            });
            console.log('signout', data);
            removeToken(() => {
                history.push("/");
            });
        } catch(error) {
            console.log(error);
        };
    };

    return (
        <div>
            <ul className="nav nav-tabs bg-primary">
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/')} to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/shop')} to="/shop">Shop</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/cart')} to="/cart">
                    <i className="material-icons">shopping_cart</i><sup><small className="cart-badge">{itemTotal()}</small></sup> 
                    </Link>
                </li>

                {isAuthenticated() && isAuthenticated().user.role === 1 && (
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/admin/dashboard')} to="/admin/dashboard">Dashboard</Link>
                    </li>
                )}

                {isAuthenticated() && isAuthenticated().user.role === 0 && (
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/user/dashboard')} to="/user/dashboard">Dashboard</Link>
                    </li>
                )}
                
                { isAuthenticated() ? ( 
                    <>
                    <li className="nav-item">
                        <span className="nav-link" style={{cursor: 'pointer', color: '#ffffff'}} onClick={() => signOut()}>Signout</span>
                    </li> 
                    </>
                ) : (
                    <>
                    <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">SignIn</Link>
                        </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">SignUp</Link>
                    </li> 
                    </>
                )}
            </ul>
        </div>
    )
};

export default withRouter(Menu);