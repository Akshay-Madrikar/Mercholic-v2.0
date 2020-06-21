import React, {useState, useEffect} from 'react';
import Layout from '../core/Layout.component';
import { isAuthenticated } from '../utils';
import { API } from '../config';
import { Link } from 'react-router-dom';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    
    const { user, token } = isAuthenticated();
    useEffect(() => {
        loadProducts();
    }, []);
    
    const loadProducts = async() => {
        try {
            const products = await fetch(`${API}/products?limit=undefined`, {
                method: "GET"
            });
            
            const productsJSON = await products.json();
            if(productsJSON.error) {
                console.log(productsJSON.error);
             } else {
                setProducts(productsJSON);
             }  
        } catch(error) {
            console.log(error);
        }
    };

    const deleteProduct = async (productId, userId, token) => {
        try {
            const product = await fetch(`${API}/product/${productId}/${userId}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const productJSON = await product.json();
            if(productJSON.error) {
                console.log(productJSON.error);
            } else {
                loadProducts();
            };
        } catch(error) {
            console.log(error);
        } 
    };

    const destroy = (productId) => {
        deleteProduct(productId, user._id, token);
    };

    return (
        <Layout
            title="Manage Products"
            description="Perform CRUD on products"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-12 m-2">
                    <ul className="list-group">
                        {products.map((product,index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <strong>{product.name}</strong>
                                <Link to={`/admin/product/update/${product._id}`}>
                                    <span className="badge badge-warning badge-pill">
                                        Update
                                    </span>
                                </Link>
                                <span 
                                    className="badge badge-danger badge-pill" 
                                    onClick={() => {destroy(product._id)}}
                                    style={{cursor: 'pointer'}}
                                >
                                    Delete
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default ManageProducts;