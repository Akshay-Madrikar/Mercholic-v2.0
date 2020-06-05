import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout.component';
import { API } from '../config';
import { authenticate, isAuthenticated } from '../utils/index';

const SignIn = () => {

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        redirectToReferrer: false
    });

    const { email, password, error, loading, redirectToReferrer} = values;
    const {user} = isAuthenticated();

    const handleChange = (name) => (event) => {
        setValues({...values, error: false, [name]: event.target.value});
    }

    const signIn = async () => {
        try {
            const userData = await fetch(`${API}/signin`, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const userDataJSON = await userData.json();
            if(userDataJSON.error) {
                setValues({
                    ...values,
                    error: userDataJSON.error,
                    loading: false
                })
            } else {
                authenticate(userDataJSON, () => {
                    setValues({
                        ...values,
                        redirectToReferrer: true
                    })
                })
                
            };
           
        } catch(error) {
            console.log(error);
        } 
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: false, loading:true});
        signIn();
    };

    const signInForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email" className="form-control" value={email} onChange={handleChange('email')}/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password" className="form-control" value={password} onChange={handleChange('password')}/>
            </div>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );
        
    const showLoading = () => (
        loading && (
        <div className="alert alert-info">
            <h2>Loading...</h2>
        </div>
        )
    );

    const redirectuser = () => {
        if(redirectToReferrer) {
            if(user && user.role === 1) {
                return <Redirect to="/admin/dashboard"/>
            } else {
                return <Redirect to="/user/dashboard"/>
            }
        }

        if(isAuthenticated()) {
            return <Redirect to="/"/>
        }
    }

    return (
        <Layout 
        title="SignUp" 
        description="Sign up Page"
        className="container col-md-8 offset-md-2"
        >
            {showError()}
            {showLoading()}
            {signInForm()}
            {redirectuser()}
        </Layout>
    )
};

export default SignIn;
