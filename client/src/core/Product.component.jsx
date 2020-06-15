import React, { useState, useEffect } from 'react';
import Layout from './Layout.component';
import { API } from '../config';
import Card from './Card.component';

const Product = (props) => {

    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [error, setError] = useState(false);

    const loadSingleProduct = async (productId) => {
        try {
            const product = await fetch(`${API}/product/${productId}`, {
                method: "GET"
            });
            
            const productJSON = await product.json();
            if(productJSON.error) {
                setError(productJSON.error);
             } else {
                 setProduct(productJSON);
                 listRelated(productJSON._id);
             }
        } catch(error) {
            console.log(error);
        }
    };

    const listRelated = async (productId) => {
        try {
            const products = await fetch(`${API}/products/related/${productId}`, {
                method: "GET"
            });
            
            const productsJSON = await products.json();
            if(productsJSON.error) {
                setError(productsJSON.error);
             } else {
                 setRelatedProduct(productsJSON);
             }
        } catch(error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const productId = props.match.params.productId;
        loadSingleProduct(productId);
    }, [props]);


    return (
        <Layout 
            title={product && product.name} 
            description={product && product.description} 
            className="container-fluid"
        >
            <div className="row">
                <div className="col-8">
                {
                   product && product.description &&
                   <Card product={product} showViewProductButton={false}/>
                }
                </div>
               
               <div className="col-4">
                   <h4>Related products</h4>
                   { relatedProduct.map((product, index) => (
                       <div className="mb-3">
                           <Card key={index} product={product}/>
                       </div>
                   )) }
               </div>
            </div>
        </Layout>
    );
};

export default Product;