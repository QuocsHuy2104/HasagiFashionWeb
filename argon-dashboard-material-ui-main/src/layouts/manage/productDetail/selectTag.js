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

<<<<<<<< HEAD:argon-dashboard-material-ui-main/src/layouts/manage/productDetail/selectTag.js
export default function MultipleSelectCheckmarks({ model, selectModel = [], onChange, nameTag }) {
    // Store the selected `id`s in `selectedIds`
    const [selectedIds, setSelectedIds] = React.useState(selectModel);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        // Handle value as an array of ids
        const newSelectedIds = typeof value === 'string' ? value.split(',') : value;
        setSelectedIds(newSelectedIds);

        if (typeof onChange === 'function') {
            onChange(newSelectedIds);
========
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
>>>>>>>> origin/kiet:argon-dashboard-material-ui-main/src/layouts/manage/product/selectTag.js
        }
    };

    const selectedNames = selectedIds
        .map(id => model.find(item => item.id === id)?.name)
        .filter(name => name); 

    return (
<<<<<<<< HEAD:argon-dashboard-material-ui-main/src/layouts/manage/productDetail/selectTag.js
        <FormControl sx={{ width: { xs: '100%', sm: '100%' } }}>
            <InputLabel id="demo-multiple-checkbox-label">{nameTag}</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedIds}
                onChange={handleChange}
                input={<OutlinedInput label={nameTag} />}
                renderValue={() => selectedNames.join(', ')}
                MenuProps={MenuProps}
            >
                {model.map((item) => (
                    <MenuItem key={item.id} value={item.id} sx={{ margin: '5px 0' }}>
                        <Checkbox checked={selectedIds.indexOf(item.id) > -1} />
                        <ListItemText primary={item.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

MultipleSelectCheckmarks.propTypes = {
    model: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    selectModel: PropTypes.arrayOf(PropTypes.number), 
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
>>>>>>>> origin/kiet:argon-dashboard-material-ui-main/src/layouts/manage/product/selectTag.js
