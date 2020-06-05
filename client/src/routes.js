import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'; 
import Home from './core/Home.component';
import SignIn from './user/Sign-In-component';
import SignUp from './user/Sign-Up-component';
import Dashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import PrivateRoute from './utils/privateRoutes';
import AdminRoute from './utils/adminRoutes';

const Routes = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/signin" component={SignIn}/>
                <Route exact path="/signup" component={SignUp}/>
                <PrivateRoute exact path="/user/dashboard" component={Dashboard}/>
                <AdminRoute exact path="/admin/dashboard" component={AdminDashboard}/>
            </Switch>
        </BrowserRouter>
    );

};

export default Routes;