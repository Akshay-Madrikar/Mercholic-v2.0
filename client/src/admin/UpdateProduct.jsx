import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout.component';
import { isAuthenticated } from '../utils';
import { Link } from 'react-router-dom';
import { API } from '../config';

const UpdateProduct = ({ match }) => {

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
        init(match.params.productId);
    }, []);

    const init = (productId) => {
        getSingleProduct(productId);
    };

    const getSingleProduct = async(productId) => {
        try {
            const product = await fetch(`${API}/product/${productId}`, {
                method: "GET"
            });
            
            const productJSON = await product.json();
            if(productJSON.error) {
                setValues({
                    ...values,
                    error: productJSON.error
                });
             } else {
                setValues({
                    ...values,
                    name: productJSON.name,
                    description: productJSON.description,
                    price: productJSON.price,
                    category: productJSON.category._id,
                    shipping: productJSON.shipping,
                    quantity: productJSON.quantity,
                    formData: new FormData()
                });
                getCategories();
             }  
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
                     categories: categoriesJSON, 
                     formData: new FormData()
                });
             }
        } catch(error) {
            console.log(error);
        }
    };

    const updateProduct = async (productId, userId, token, product) => {
        try {
            const productData = await fetch(`${API}/product/${productId}/${userId}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: product
            });

            const productDataJSON = await productData.json();
            if(productDataJSON.error) {
                setValues({
                    ...values,
                    error: productDataJSON.error
                });
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
                });
                getSingleProduct(productId);
            };
        } catch(error) {
            console.log(error);
        } 
    };

    
    const handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value)
        setValues({...values, [name]: value});
    };

    
    const handleSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: '', loading: true});
        updateProduct(match.params.productId, user._id, token, formData);
    };

    const updateForm = () => (
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

            <button className="btn btn-outline-primary">Update Product</button>
        </form>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>
            <h2>{`${name}`} is updated!</h2>
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
                    {updateForm()}
                    {goBack()}
                </div>
            </div> 
        </Layout>
    );
};
export default UpdateProduct;