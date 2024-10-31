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

export default function MultipleSelectCheckmarks({ model, selectModel = [], onChange, nameTag }) {
    const [selectedValues, setSelectedValues] = React.useState(selectModel);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        const newSelectModel = typeof value === 'string' ? value.split(',') : value;
        setSelectedValues(newSelectModel);

        if (typeof onChange === 'function') {
            onChange(newSelectModel);
        }
    };

    return (
        <FormControl sx={{ width: { xs: '100%', sm: '100%' } }}>
            <InputLabel id="demo-multiple-checkbox-label">{nameTag}</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedValues}
                onChange={handleChange}
                input={<OutlinedInput label={nameTag} />}
                renderValue={(selected) => selected.join(', ')}
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
            id: PropTypes.string.isRequired,  // Ensure 'id' is defined here
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    selectModel: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    nameTag: PropTypes.string.isRequired,
};
