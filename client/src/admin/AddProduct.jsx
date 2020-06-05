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
        redirectToProfile,
        formData
    } = values;

    const handleChange = (name) => (event) => {

    }

    const newPostForm = () => (
        <form className="mb-3">
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
                    <option value="5ed74e32ffa45a0eb096f539">Rapper</option>
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

    const { user, token } = isAuthenticated();

    // const createCategory = async () => {
    //     try {
    //         const productData = await fetch(`${API}/product/create/${user._id}`, {
    //             method: "POST",
    //             headers: {
    //                 Accept: 'application/json',
    //                 "Authorization": "Bearer "+token
    //             }
    //         });
    //         const productDataJSON = await productData.json();
    //         if(productDataJSON.error) {
    //             setError(true);
    //             setError(productDataJSON.error)
    //         } else {
    //             setError('');
    //             setSuccess(true);
    //         };  
    //     } catch(error) {
    //         console.log(error);
    //     } 
    // };
    
    // const handleChange = (event) => {
    //     setError('');
    //     setName(event.target.value);
    // }

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     setError('');
    //     setSuccess(false);
    //     createCategory();
    //     event.target.value = '';
    // }

    // const newCategoryForm = () => (
    //     <form onSubmit={handleSubmit}>
    //         <div className="form-group">
    //             <label className="text-muted">Name</label>
    //             <input 
    //                 type="text" 
    //                 className="form-control" 
    //                 value={name} 
    //                 onChange={handleChange} 
    //                 autoFocus
    //                 required
    //             />
    //         </div>
    //         <button className="btn btn-outline-primary">Create Category</button>
    //     </form>
    // );

    // const showSuccess = () => {
    //     if(success) {
    //         return <h2 className="text-success">{name} is created</h2>
    //     };
    // };

    // const showError = () => {
    //     if(error) {
    //         return <h2 className="text-danger">{name} category already exists!</h2>
    //     };
    // };

    const goBack = () => (
        <div className="mt-5">
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
                    {newPostForm()}
                    {goBack()}
                </div>
            </div> 
        </Layout>
    );
};
export default AddProduct;