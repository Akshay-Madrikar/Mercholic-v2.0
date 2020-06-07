import React, {useState, Fragment} from 'react';

const RadioButton = ({ prices, handleFilters }) => {

    const [value, setValue] = useState(0);

    const handleChange = (event) => {
        handleFilters(event.target.value);
        setValue(event.target.value)
    }

    return prices.map((price, index) => (
        <div className="list-unstyled" key={index}>
            <input 
                type="radio" 
                className="mr-2 ml-4" 
                name={price}
                value={`${price._id}`} 
                onChange={handleChange}
            />
            <label className="form-check-label">{price.name}</label>
        </div>
    ));
};

export default RadioButton;
