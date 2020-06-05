import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'; 
import Home from './core/Home.component';
import SignIn from './user/Sign-In-component';
import SignUp from './user/Sign-Up-component';

const Routes = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/signin" component={SignIn}/>
                <Route exact path="/signup" component={SignUp}/>
            </Switch>
        </BrowserRouter>
    );

};

export default Routes;