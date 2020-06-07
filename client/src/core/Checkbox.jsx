import React, {useState} from 'react';

const Checkbox = ({ categories, handleFilters }) => {

    const [checked, setChecked] = useState([]);

    const handleChange = (id) => () => {
        //return the first index or -1
        const currentCategoryId = checked.indexOf(id);
        const newCheckedCategoryId = [...checked];

        //if currently checked was not already in checked state then push
        //else pull/take off
        if(currentCategoryId === -1) {
            newCheckedCategoryId.push(id);
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }
        setChecked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);
    };

    return categories.map((category, index) => (
        <li className="list-unstyled" key={index}>
            <input 
                type="checkbox" 
                className="form-check-input" 
                value={checked.indexOf(category._id === -1)} 
                onChange={handleChange(category._id)}
            />
            <label className="form-check-label">{category.name}</label>
        </li>
    ));
};

export default Checkbox;