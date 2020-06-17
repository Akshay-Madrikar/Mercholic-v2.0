import React, { useState, useEffect } from 'react';
import Layout from './Layout.component';
import { API } from '../config';
import Checkbox from './Checkbox';
import RadioButton from './RadioButton';
import Card from './Card.component';
import { prices } from './fixedPrices';

const Shop = () => {

    const [myFilters, setMyFilters] = useState({
        filters: {
            category: [],
            price: []
        }
    });
    const [error, setError] = useState(false);
    const [categories, setCategories] = useState([]);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [filteredResults, setFilteredResults] = useState([]);

    const getCategories = async() => {
        try {
            const categories = await fetch(`${API}/categories`, {
                method: "GET"
            });
            
            const categoriesJSON = await categories.json();
            if(categoriesJSON.error) {
                setError(categoriesJSON.error);
             } else {
                 // load categories from backend and set form data
                 setCategories(categoriesJSON);
             }
        } catch(error) {
            console.log(error);
        }
    };

    const getFilteredProducts = async (filters = {}) => {
        try {
            const data = {
                limit,
                skip,
                filters
            }
            const products = await fetch(`${API}/products/by/search`, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const productsJSON = await products.json();
            if(productsJSON.error) {
                setError(productsJSON.error)
            } else {
                setFilteredResults(productsJSON.productsBySearch);
                setSize(productsJSON.size);
                setSkip(0);
            };  
        } catch(error) {
            console.log(error);
        } 
    };

    const loadMore = async () => {
        try {
            let toSkip = skip + limit;

            const data = {
                limit,
                skip: toSkip,
                filters: myFilters.filters
            }
            const products = await fetch(`${API}/products/by/search`, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const productsJSON = await products.json();
            if(productsJSON.error) {
                setError(productsJSON.error)
            } else {
                setFilteredResults([...filteredResults, ...productsJSON.productsBySearch]);
                setSize(productsJSON.size);
                setSkip(toSkip);
            };  
        } catch(error) {
            console.log(error);
        } 
    };

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        );
    };

    const loadFilteredResults = (newFilters) => {
        getFilteredProducts(newFilters);
    };

    useEffect(() => {
        getCategories();
        loadFilteredResults(myFilters.filters);
    }, []);

    const handleFilters = (filters, filterBy) => {
        const newFilters = {...myFilters};
        newFilters.filters[filterBy] = filters;

        if(filterBy === 'price') {
            let priceValues = handlePrices(filters);
            newFilters.filters[filterBy] = priceValues;
        }
        loadFilteredResults(myFilters.filters);
        setMyFilters(newFilters);
    };

    const handlePrices = (value) => {
        const data = prices;
        let arr = [];

        for(let key in data) {
            if(data[key]._id === parseInt(value)) {
                arr = data[key].array;
            }
        }
        return arr;
    };

    return (
        <Layout title="Shop Page" description="Shop OG merch of your choice" className="container-fluid">
            <div className="row">
                <div className="col-4">
                    <h4>Filter by categories</h4>
                    <ul>
                        <Checkbox categories={categories} handleFilters={ filters => handleFilters(filters, 'category')}/>
                    </ul>

                    <h4>Filter by &#x20b9; price range</h4>
                    <div>
                        <RadioButton prices={prices} handleFilters={ filters => handleFilters(filters, 'price')}/>
                    </div>
                </div>
                <div className="col-8">
                    <h2 className="mb-4">Products</h2>
                    <div className="row">
                     {/* {JSON.stringify(filteredResults)} */}

                     { filteredResults.map((product, index) => (
                            <div key={index} className="col-4 mb-3">
                                <Card product={product} showDetails={false}/>
                            </div> 
                     ))}
                    </div>
                    <hr/>
                    {loadMoreButton()}
                </div>
            </div>
        </Layout>
    );
};

export default Shop;