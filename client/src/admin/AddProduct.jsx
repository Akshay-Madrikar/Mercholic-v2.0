import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout.component';
import { isAuthenticated } from '../utils';
import { Link } from 'react-router-dom';
import { API } from '../config';

const AddProduct = () => {

    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    });

    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        formData
    } = values;

    const { user, token } = isAuthenticated();

    useEffect(() => {
        getCategories();
    }, []);

    const handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value)
        setValues({...values, [name]: value});
    };

    
    const handleSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: '', loading: true});
        createProduct();
    };

    const createProduct = async () => {
        try {
            const productData = await fetch(`${API}/product/create/${user._id}`, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    "Authorization": "Bearer "+token
                },
                body: formData
            });
            const productDataJSON = await productData.json();
            if(productDataJSON.error) {
               setValues({...values, error: productDataJSON.error});
            } else {
                setValues({
                    ...values,
                    name: '',
                    description: '',
                    photo: '',
                    price: '',
                    quantity: '',
                    loading: false,
                    createdProduct: productDataJSON.name
                })
            };
            console.log(createdProduct)  
        } catch(error) {
            console.log(error);
        } 
    };

    const getCategories = async() => {
        try {
            const categories = await fetch(`${API}/categories`, {
                method: "GET"
            });
            
            const categoriesJSON = await categories.json();
            if(categoriesJSON.error) {
                setValues({...values, error: categoriesJSON.error});
             } else {
                 // load categories from backend and set form data
                 setValues({
                     ...values, 
                     categories: categoriesJSON, 
                     formData: new FormData()
                });
             }
        } catch(error) {
            console.log(error);
        }
    };


    const newPostForm = () => (
        <form className="mb-3" onSubmit={handleSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input type="file" name="photo" accept="image/*" onChange={handleChange('photo')}/>
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={handleChange('name')}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea 
                    type="text" 
                    className="form-control" 
                    value={description} 
                    onChange={handleChange('description')}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={price} 
                    onChange={handleChange('price')}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select 
                    type="text" 
                    className="form-control" 
                    value={category} 
                    onChange={handleChange('category')}
                >
                    <option>Select category</option>
                    { categories && categories.map((category, index) => (
                        <option key={index} value={category._id}>{category.name}</option>
                    )) }
                    
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select 
                    type="text" 
                    className="form-control" 
                    value={shipping} 
                    onChange={handleChange('shipping')}
                >
                    <option>Select shipping status</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input 
                    type="number" 
                    className="form-control" 
                    value={quantity} 
                    onChange={handleChange('quantity')}
                />
            </div>

            <button className="btn btn-outline-primary">Create Product</button>
        </form>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
            <h2>{`${name}`} is created!</h2>
        </div>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showLoading = () => (
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        )
    );

    const goBack = () => (
        <div className="mt-4 mb-2">
            <Link to="/admin/dashboard" className="text-warning">
                Back to dashboard
            </Link>
        </div>
    )

    return (
        <Layout
            title="Add a new product"
            description={`G'day ${user.name}, ready to add a new product`}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showError()}
                    {showSuccess()}
                    {newPostForm()}
                    {goBack()}
                </div>
            </div> 
        </Layout>
    );
};
export default AddProduct;