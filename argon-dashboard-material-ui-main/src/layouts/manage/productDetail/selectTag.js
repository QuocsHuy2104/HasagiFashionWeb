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
        }
    };

    const selectedNames = selectedIds
        .map(id => model.find(item => item.id === id)?.name)
        .filter(name => name); 

    return (
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
