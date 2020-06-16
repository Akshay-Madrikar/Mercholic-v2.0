import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'; 
import Home from './core/Home.component';
import Shop from './core/Shop.component';
import SignIn from './user/Sign-In-component';
import SignUp from './user/Sign-Up-component';
import Dashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import PrivateRoute from './utils/privateRoutes';
import AdminRoute from './utils/adminRoutes';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Product from './core/Product.component';
import Cart from './core/Cart.component';

const Routes = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/shop" component={Shop}/>
                <Route exact path="/signin" component={SignIn}/>
                <Route exact path="/signup" component={SignUp}/>
                <Route exact path="/product/:productId" component={Product}/>
                <Route exact path="/cart" component={Cart}/>
                <PrivateRoute exact path="/user/dashboard" component={Dashboard}/>
                <AdminRoute exact path="/admin/dashboard" component={AdminDashboard}/>
                <AdminRoute exact path="/create/category" component={AddCategory}/>
                <AdminRoute exact path="/create/product" component={AddProduct}/>
            </Switch>
        </BrowserRouter>
    );

};

export default Routes;