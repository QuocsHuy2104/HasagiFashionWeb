import * as React from 'react';
import PropTypes from 'prop-types';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import './style.css';

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

export default function MultipleSelectCheckmarks({ roles, selectedRoles, onRoleChange }) {
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        const newSelectedRoles = typeof value === 'string' ? value.split(',') : value;

        if (typeof onRoleChange === 'function') {
            onRoleChange(newSelectedRoles);
        }
    };

    return (
        <FormControl sx={{ width: { xs: '100%', sm: '100%' } }}>  {/* Full width on small screens, fixed on larger */}
            <InputLabel id="demo-multiple-checkbox-label">Vai trò</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedRoles}
                onChange={handleChange}
                input={<OutlinedInput label="Roles" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
            >
                {roles.map((role) => (
                    <MenuItem key={role.name} value={role.name} sx={{ margin: '5px 0' }}>
                        <Checkbox checked={selectedRoles.indexOf(role.name) > -1} />
                        <ListItemText primary={role.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

    );
}

MultipleSelectCheckmarks.propTypes = {
    roles: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    selectedRoles: PropTypes.arrayOf(PropTypes.string),
    onRoleChange: PropTypes.func.isRequired,
};

MultipleSelectCheckmarks.defaultProps = {
    selectedRoles: [],
};