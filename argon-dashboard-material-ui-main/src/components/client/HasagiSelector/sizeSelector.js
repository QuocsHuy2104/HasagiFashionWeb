import React, { useState } from 'react';
import '../assets/css/sizeSelector.css'; // Ensure the CSS path is correct
import PropTypes from 'prop-types';

const SizeSelector = ({ sizes = [], onSizeSelect }) => {  // Use default parameter for sizes
    const [selectedSize, setSelectedSize] = useState(null);

    const handleSizeClick = (size) => {
        setSelectedSize(size);
        if (onSizeSelect) onSizeSelect(size.id);
    };

    if (!Array.isArray(sizes) || sizes.length === 0) {
        return <div className="error-message">Error: sizes must be a non-empty array</div>;
    }

    return (
        <div className="size-selector">
            {sizes.map((size) => (
                <div
                    key={size.id}
                    className={`size-button ${selectedSize?.id === size.id ? 'selected' : ''}`}
                    onClick={() => handleSizeClick(size)}
                >
                    {size.name}
                </div>
            ))}
        </div>
    );
};

SizeSelector.propTypes = {
    sizes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSizeSelect: PropTypes.func.isRequired
};

export default SizeSelector;
