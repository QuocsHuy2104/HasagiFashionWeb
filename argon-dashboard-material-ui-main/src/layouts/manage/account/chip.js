
import * as React from 'react';
import PropTypes from 'prop-types'; 
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { InputLabel } from '@mui/material';

import './style.css'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 15;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function MultipleSelectChip({ roles, selectedRoles, onChange }) {
  const theme = useTheme();

  const handleChange = (event) => {
    const { value } = event.target;
    onChange(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id="demo-multiple-chip-label">Chọn vai trò</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={selectedRoles}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {roles
          .filter(role => role.name !== "USER" && role.name !== "ADMIN") // Exclude "USER" and "ADMIN"
          .map((role) => (
            <MenuItem
              key={role.name}
              value={role.name}
              style={getStyles(role.name, selectedRoles, theme)}
            >
              {role.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}


MultipleSelectChip.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MultipleSelectChip;
