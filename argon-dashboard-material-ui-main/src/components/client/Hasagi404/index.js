import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '72px', color: '#ff6b6b' }}>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" style={{ fontSize: '20px', color: '#007bff' }}>
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound;
