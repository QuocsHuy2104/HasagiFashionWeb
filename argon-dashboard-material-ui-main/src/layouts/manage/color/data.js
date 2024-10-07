import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import ColorService from '../../../services/ColorServices';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nameColor', headerName: 'Name Color', width: 130 },
];

export default function DataTable({ onEditClick, onDeleteClick }) {
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

    const fetchData = async () => {
        try {
            const response = await ColorService.getAllColors();
            const colors = response.data || [];
            const formattedData = colors.map((color) => ({
                id: color.id,
                nameColor: color.name,
            }));
            setRows(formattedData);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelectionModelChange = (newSelectionModel) => {
        setSelectedRows(newSelectionModel);
    };

    const handleDelete = async () => {
        if (selectedRows.length > 0) {
            await onDeleteClick(selectedRows);
            fetchData();
        }
    };


    return (
        <Paper sx={{ height: 400, width: '100%', position: 'relative' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleSelectionModelChange}
                sx={{ border: 0 }}
            />

            {selectedRows.length > 0 && (
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </Box>
            )}
        </Paper>
    );
}

DataTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
};
