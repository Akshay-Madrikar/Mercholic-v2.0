import React, { useState, useEffect } from 'react';
import Layout from './Layout.component';
import { API } from '../config';
import Card from './Card.component';

const Checkout = ({products}) => {
    return <div>{JSON.stringify(products)}</div>
};

export default Checkout;