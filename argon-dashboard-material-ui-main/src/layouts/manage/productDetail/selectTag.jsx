import React, { useState } from "react";
import PropTypes from 'prop-types';
<<<<<<<< HEAD:argon-dashboard-material-ui-main/src/layouts/manage/productDetail/selectTag.jsx

import '../account/style.css';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
========
import ArgonBox from 'components/ArgonBox';

const SelectImage = ({ image, onImageChange }) => {
    const [selectedImage, setSelectedImage] = useState(image || '');
    const [selectedFile, setSelectedFile] = useState(null); // Track the selected file
    const [errorMessage, setErrorMessage] = useState('');
>>>>>>>> origin/khang:argon-dashboard-material-ui-main/src/layouts/manage/product/selectTag.js

    // Validate image file type and size
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                setErrorMessage('Please select a valid image (JPEG, PNG, GIF)');
                return;
            }

<<<<<<<< HEAD:argon-dashboard-material-ui-main/src/layouts/manage/productDetail/selectTag.jsx
export default function MultipleSelectCheckmarks({ model, selectModel = [], onChange, nameTag }) {
    const [selectedValues, setSelectedValues] = React.useState(selectModel);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        const newSelectModel = typeof value === 'string' ? value.split(',') : value;
        setSelectedValues(newSelectModel);
========
            const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSizeInBytes) {
                setErrorMessage('File size exceeds 2MB');
                return;
            }
>>>>>>>> origin/khang:argon-dashboard-material-ui-main/src/layouts/manage/product/selectTag.js

            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setSelectedFile(file);
            setErrorMessage('');
            onImageChange(file);
        }
    };

    return (
<<<<<<<< HEAD:argon-dashboard-material-ui-main/src/layouts/manage/productDetail/selectTag.jsx
        <FormControl sx={{ width: { xs: '100%', sm: '100%' } }}>
            <InputLabel id="demo-multiple-checkbox-label">{nameTag}</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedValues}
                onChange={handleChange}
                input={<OutlinedInput label={nameTag} />}
                renderValue={(selected) =>
                    selected
                        .map((id) => model.find((item) => item.id === id)?.name || '')
                        .join(', ')
                }
                MenuProps={MenuProps}
            >
                {model.map((children) => (
                    <MenuItem key={children.id} value={children.id} sx={{ margin: '5px 0' }}>
                        <Checkbox checked={selectedValues.indexOf(children.id) > -1} />
                        <ListItemText primary={children.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

MultipleSelectCheckmarks.propTypes = {
    model: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired, // Ensure 'id' is a string for consistency
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    selectModel: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    nameTag: PropTypes.string.isRequired,
};
========
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
>>>>>>>> origin/khang:argon-dashboard-material-ui-main/src/layouts/manage/product/selectTag.js
