import React, { useState } from "react";
import PropTypes from 'prop-types';
import ArgonBox from 'components/ArgonBox';

const SelectImage = ({ image, onImageChange }) => {
    const [selectedImage, setSelectedImage] = useState(image || '');
    const [selectedFile, setSelectedFile] = useState(null); // Track the selected file
    const [errorMessage, setErrorMessage] = useState('');

    // Validate image file type and size
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                setErrorMessage('Please select a valid image (JPEG, PNG, GIF)');
                return;
            }

            const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSizeInBytes) {
                setErrorMessage('File size exceeds 2MB');
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setSelectedFile(file);
            setErrorMessage('');
            onImageChange(file);
        }
    };

    return (
        <ArgonBox
            position="relative"
            width="200px"
            height="200px"
            sx={{ cursor: 'pointer' }}
        >
            <ArgonBox
                component='img'
                src={selectedImage === '' ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930" : selectedImage}
                alt='Product'
                width="100%"
                height="100%"
                sx={{ objectFit: 'cover', borderRadius: '8px' }}
                onClick={() => document.getElementById('file-input').click()}
            />
            <input
                type="file"
                id="file-input"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
            />
            {errorMessage && <ArgonBox color="error">{errorMessage}</ArgonBox>}
        </ArgonBox>
    );
};

const isValidUrl = (props, propName, componentName) => {
    const url = props[propName];
    if (url && typeof url === 'string') {
        const urlPattern = new RegExp('^(https?:\\/\\/)?' + 
            '((([a-zA-Z0-9$_.+!*\'(),;?&=-]|%[0-9a-fA-F]{2})+@)?' + 
            '((([0-9]{1,3}\\.){3}[0-9]{1,3})|' + 
            '(([a-zA-Z0-9$_.+!*\'(),;?&=-]|%[0-9a-fA-F]{2})+\\.)+[a-zA-Z]{2,}))' + 
            '(:[0-9]{2,5})?' + 
            '(\\/([a-zA-Z0-9$_.+!*\'(),;?&=-]|%[0-9a-fA-F]{2})*)*' + 
            '(\\?[a-zA-Z0-9$_.+!*\'(),;?&=-]|%[0-9a-fA-F]{2})*' + 
            '(#[a-zA-Z0-9$_.+!*\'(),;?&=-]|%[0-9a-fA-F]{2})*$');
        if (!urlPattern.test(url)) {
            return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`);
        }
    }
    return null;
};

SelectImage.propTypes = {
    image: isValidUrl,
    onImageChange: PropTypes.func.isRequired, // Add callback prop to notify parent
};

SelectImage.defaultProps = {
    image: '',
};

export default SelectImage;
