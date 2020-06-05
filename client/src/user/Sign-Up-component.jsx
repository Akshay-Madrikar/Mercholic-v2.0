import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout.component';
import { API } from '../config';

const SignUp = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    const {name, email, password, error, success} = values;

    const handleChange = (name) => (event) => {
        setValues({...values, error: false, [name]: event.target.value});
    }

    const signUp = async () => {
        try {
            const userData = await fetch(`${API}/signup`, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
            const userDataJSON = await userData.json();
            if(userDataJSON.error) {
                setValues({
                    ...values,
                    error: userDataJSON.error.message,
                    success: false
                })
            } else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    success: true
                })
            };
           
        } catch(error) {
            console.log(error);
        } 
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: false});
        signUp();
    };

    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" value={name} onChange={handleChange('name')}/>
            </div>
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
        
    const showSuccess = () => (
        <div className="alert alert-info" style={{display: success ? '' : 'none'}}>
            New account is created. Please <Link to='/signin'>signin</Link>
        </div>
    );

    return (
        <Layout 
            title="SignUp" 
            description="Sign up Page"
            className="container col-md-8 offset-md-2"
        >
            {showError()}
            {showSuccess()}
            {signUpForm()}
        </Layout>
    )
};

export default SignUp;