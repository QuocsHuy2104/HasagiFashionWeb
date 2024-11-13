import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import ColorService from 'services/ColorServices';

import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
} from '@mui/x-data-grid';

import { randomCreatedDate, randomTraderName, randomId } from '@mui/x-data-grid-generator';

const EditToolbar = ({ setRows, setRowModesModel }) => {
    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [
            ...oldRows,
            { id, name: '', age: '', role: '', joinDate: randomCreatedDate(), isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add Product Details
            </Button>
        </GridToolbarContainer>
    );
};

export default function FullFeaturedCrudGrid() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [roles, setRoles] = useState([]);

    // Fetch roles from ColorService
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await ColorService.getAllColors();
                const roleNames = response.data.map((color) => color.name); // Assuming `name` is the field
                setRoles(roleNames);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            }
        };
        fetchRoles();
    }, []);

    // Generate initial rows
    useEffect(() => {
        if (roles.length > 0) {
            const initialRows = Array.from({ length: 5 }).map(() => ({
                id: randomId(),
                name: randomTraderName(),
                age: Math.floor(Math.random() * 40 + 20),
                joinDate: randomCreatedDate(),
                role: roles[Math.floor(Math.random() * roles.length)], // Random role from loaded roles
            }));
            setRows(initialRows);
        }
    }, [roles]);

    const handleSaveClick = (id) => () => {
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.View },
        }));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        }));
    };

    const handleDeleteClick = (id) => () => {
        setRows((oldRows) => oldRows.filter((row) => row.id !== id));
    };

    const handleEditClick = (id) => () => {
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit },
        }));
    };

    const columns = [
        { field: 'name', headerName: 'Name', width: 180, editable: true },
        {
            field: 'quantity',
            headerName: 'Số Lượng',
            type: 'number',
            width: 80,
            align: 'right',
            headerAlign: 'right',
            editable: true,
        },
        {
            field: 'price',
            headerName: 'Giá',
            type: 'number',
            width: 80,
            align: 'right',
            headerAlign: 'right',
            editable: true,
        },
        {
            field: 'priceSize',
            headerName: 'Giá kích thước',
            type: 'number',
            width: 80,
            align: 'right',
            headerAlign: 'right',
            editable: true,
        },
        {
            field: 'role',
            headerName: 'Department',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: roles,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(id)}
                            sx={{ color: 'primary.main' }}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={(model) => setRowModesModel(model)}
                processRowUpdate={(newRow) => {
                    setRows((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)));
                    return newRow;
                }}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );
}
