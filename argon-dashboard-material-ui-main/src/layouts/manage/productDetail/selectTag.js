import * as React from 'react';
import PropTypes from 'prop-types';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import '../account/style.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function MultipleSelectCheckmarks({ model, selectedModel = [], onChange, nameTag }) {
    const [selectedValues, setSelectedValues] = React.useState(Array.isArray(selectedModel) ? selectedModel : []);
    React.useEffect(() => {
        setSelectedValues(Array.isArray(selectedModel) ? selectedModel : []);
    }, [selectedModel]);

    const handleSelectionChange = (event) => {
        const { value } = event.target;
        setSelectedValues(value);
        onChange(value); 
    };

    return (
        <FormControl fullWidth>
            <InputLabel>{nameTag}</InputLabel>
            <Select
                multiple
                value={selectedValues}
                onChange={handleSelectionChange}
                input={<OutlinedInput label={nameTag} />}
                renderValue={(selected) =>
                    selected.map((id) => {
                        const item = model.find((item) => item.id === id);
                        return item ? item.name : '';
                    }).join(', ')
                }
                MenuProps={MenuProps}
            >
                {model.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        <Checkbox checked={Array.isArray(selectedValues) && selectedValues.indexOf(item.id) > -1} />
                        <ListItemText primary={item.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

MultipleSelectCheckmarks.propTypes = {
    model: PropTypes.array.isRequired,
    selectedModel: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    nameTag: PropTypes.string.isRequired,
};
