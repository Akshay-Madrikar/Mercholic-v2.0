import React, { useState, useEffect } from 'react';
import Layout from './Layout.component';
import { API } from '../config';
import Card from './Card.component';
import Search from './Search.component';

const Home = () => {

    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);


    const loadProductsBySell = async() => {
        try {
            const products = await fetch(`${API}/products?sortBy=sold&order=desc&limit=6`, {
                method: "GET"
            });
            
            const productsJSON = await products.json();
            if(productsJSON.error) {
                setError(productsJSON.error)
             } else {
                setProductsBySell(productsJSON)
             }  
        } catch(error) {
            console.log(error);
        }
    };

    const loadProductsByArrival = async() => {
        try {
            const products = await fetch(`${API}/products?sortBy=createdAt&order=desc&limit=6`, {
                method: "GET"
            });
            
            const productsJSON = await products.json();
            if(productsJSON.error) {
                setError(productsJSON.error)
             } else {
                setProductsByArrival(productsJSON)
             }  
        } catch(error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadProductsBySell();
        loadProductsByArrival();
    }, [])

    return (
        <Layout title="Home" description="MERN stack project" className="container-fluid">
            <Search />
            <h2 className="mb-4">New Arrivals</h2>
            <div className="row">
                { productsByArrival.map((product, index) => (
                    <div key={index} className="col-4 mb-3">
                        <Card product={product} showDetails={false}/>
                    </div> 
                )) }
            </div>

            <h2 className="mb-4">Best Sellers</h2>
            <div className="row">
                { productsBySell.map((product, index) => (
                    <div key={index} className="col-4 mb-3">
                        <Card product={product} showDetails={false}/>
                    </div> 
                )) }
            </div>
            
        </Layout>
    );
};

export default Home;