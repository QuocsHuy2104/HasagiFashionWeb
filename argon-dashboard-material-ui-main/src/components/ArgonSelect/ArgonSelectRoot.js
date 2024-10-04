// src/components/ArgonSelect/ArgonSelectRoot.js
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap'; // Hoặc thư viện tương tự nếu cần

const ArgonSelectRoot = React.forwardRef(({ options, ...props }, ref) => (
    <Form.Control
        as="select"
        ref={ref}
        {...props}
    >
        {options.map(option => (
            <option value={option.value} key={option.value}>
                {option.label}
            </option>
        ))}
    </Form.Control>
));

ArgonSelectRoot.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ArgonSelectRoot;
