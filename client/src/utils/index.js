export const authenticate = (data, cb) => {
    if(typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data));
        cb();
    };
};

export const removeToken = (cb) => {
    if(typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        cb();
    };
};

export const isAuthenticated = () => {
    if(typeof window === 'undefined') {
        return false;
    };

    if(localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }
};