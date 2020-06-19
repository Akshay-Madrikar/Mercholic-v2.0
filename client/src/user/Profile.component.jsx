import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout.component';
import { isAuthenticated, updateUser } from '../utils';
import { API } from '../config';

const Profile = ({ match }) => {    

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: false,
        success: false
    });

    const { token } = isAuthenticated();
    const { name, email, password } = values;

    const init = (userId) => {
        getUserProfile(userId, token);
    };

    useEffect(() => {
        init(match.params.userId);
    }, []);

    const getUserProfile = async (userId, token) => {
        try {
            const user = await fetch(`${API}/user/${userId}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const userJSON = await user.json();
            if(userJSON.error) {
                setValues({ ...values, error: true });
            } else {
                setValues({
                    ...values,
                    name: userJSON.name,
                    email: userJSON.email
                });
            };
        } catch(error) {
            console.log(error);
        } 
    };

    const updateUserProfile = async (userId, token, userData) => {
        try {
            const user = await fetch(`${API}/user/${userId}`, {
                method: "PUT",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            const userJSON = await user.json();
            if(userJSON.error) {
                console.log(userJSON.error);
            } else {
                updateUser(userJSON, () => {
                    setValues({
                        ...values,
                        name: userJSON.name,
                        email: userJSON.email,
                        success: true
                    });
                })
            };
        } catch(error) {
            console.log(error);
        } 
    };

    const handleChange = (name) => (event) => {
        setValues({
            ...values,
            error: false,
            [name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateUserProfile(match.params.userId, token, { name, email, password });
    };

    const profileDetails = (name, email, password) => (
        <form className="m-5" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    type="text" 
                    onChange={handleChange('name')}
                    className="form-control"
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    type="email" 
                    onChange={handleChange('email')}
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    type="password" 
                    onChange={handleChange('password')}
                    className="form-control"
                    value={password}
                />
            </div>

            <button className="btn btn-primary">Submit</button>
        </form>
    );

    return (
        <Layout title="Profile" description="Update your profile" className="container-fluid">
            <h2 className="mb-4">Profile</h2>
            {profileDetails(name, email, password)}
        </Layout>
    );
};

export default Profile;