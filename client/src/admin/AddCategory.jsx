import React, { useState } from 'react';
import Layout from '../core/Layout.component';
import { isAuthenticated } from '../utils';
import { Link } from 'react-router-dom';
import { API } from '../config';

const AddCategory = () => {

    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { user, token } = isAuthenticated();

    const createCategory = async () => {
        try {
            const categoryData = await fetch(`${API}/category/create/${user._id}`, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+token
                },
                body: JSON.stringify({
                   name
                })
            });
            const categoryDataJSON = await categoryData.json();
            if(categoryDataJSON.error) {
                setError(true);
                setError(categoryDataJSON.error)
            } else {
                setError('');
                setSuccess(true);
            };  
        } catch(error) {
            console.log(error);
        } 
    };
    
    const handleChange = (event) => {
        setError('');
        setName(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setSuccess(false);
        createCategory();
    }

    const newCategoryForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={handleChange} 
                    autoFocus
                    required
                />
            </div>
            <button className="btn btn-outline-primary">Create Category</button>
        </form>
    );

    const showSuccess = () => {
        if(success) {
            return <h2 className="text-success">{name} is created</h2>
        };
    };

    const showError = () => {
        if(error) {
            return <h2 className="text-danger">{name} category already exists!</h2>
        };
    };

    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">
                Back to dashboard
            </Link>
        </div>
    )

    return (
        <Layout
            title="Add a new category"
            description={`G'day ${user.name}, ready to add a new category`}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showError()}
                    {showSuccess()}
                    {newCategoryForm()}
                    {goBack()}
                </div>
            </div> 
        </Layout>
    );
};
export default AddCategory;