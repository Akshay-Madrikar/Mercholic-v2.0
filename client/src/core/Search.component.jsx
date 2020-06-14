import React, { useState, useEffect } from 'react';
import { API } from '../config';
import queryString from 'query-string';
import Card from './Card.component';

const Search = () => {

    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false
    });

    const { categories, category, search, results, searched } = data;

    const getCategories = async() => {
        try {
            const categories = await fetch(`${API}/categories`, {
                method: "GET"
            });
            
            const categoriesJSON = await categories.json();
            if(categoriesJSON.error) {
                console.log(categoriesJSON.error);
             } else {
                 setData({...data, categories: categoriesJSON});
             }
        } catch(error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const list = async (params) => {
        try {
            const query = queryString.stringify(params);
            const products = await fetch(`${API}/products/search?${query}`, {
                method: "GET"
            });
            
            const productsJSON = await products.json();
            if(productsJSON.error) {
                console.log(productsJSON.error)
             } else {
                 setData({...data, results: productsJSON, searched: true})
             }  
        } catch(error) {
            console.log(error);
        }
    };

    const searchData = () => {
        console.log(search, category)
        if(search) {
            list({search: search || undefined, category: category});
        }
    };

    const searchSubmit = (event) => {
        event.preventDefault();
        searchData();
    };

    const handleChange = (name) => (event) => {
        setData({...data, [name]: event.target.value, searched:false})
    };

    const searchMessage = (searched, results) => {
        if(searched && results.length > 0) {
            return `Found ${results.length} products`
        }

        if(searched && results.length < 1) {
            return `No products found`
        }
    };

    const searchedProducts = (results = []) => {
        return(
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}
                </h2>

                <div className="row">
                    { results.map((product, index) => (
                        <Card key={index} product={product}/>
                    )) }
                </div>
            </div>
            
        );
    };

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select className="btn mr-2" onChange={handleChange('category')}>
                            <option value="All">All</option>
                            { categories.map((category, index) => (
                                <option key={index} value={category._id}>
                                    {category.name}
                                </option>
                            )) 
                            }
                        </select>
                    </div>

                    <input 
                        type="search"
                        className="form-control"
                        onChange={handleChange('search')}
                        placeholder="Search by name"
                    />
                </div>

                <div className="btn input-group-append" style={{border: 'none'}}>
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>
    );

    return (
        <div className="row mb-3">
           <div className="container">
               {searchForm()}
           </div>
           <div className="container-fluid mb-3">
               {searchedProducts(results)}
           </div>
        </div>
    );
};

export default Search;