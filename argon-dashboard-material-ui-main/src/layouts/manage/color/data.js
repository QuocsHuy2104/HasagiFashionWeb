import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import ColorService from '../../../services/ColorServices';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
        <Paper style={{ height: 420, width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={handleSelectionModelChange}
                sx={{
                    "& .MuiDataGrid-cell": {
                        fontSize: "0.75rem",
                        padding: "4px",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        fontSize: "0.8rem",
                    },
                    "& .MuiTablePagination-root": {
                        fontSize: "0.75rem",
                        minHeight: "30px",
                    },
                    "& .MuiTablePagination-select": {
                        fontSize: "0.75rem",
                        padding: "4px",
                    },
                    "& .MuiTablePagination-displayedRows": {
                        fontSize: "0.75rem",
                    },
                }}
                rowHeight={40}
            />
            <Box display="flex" justifyContent="flex-end" marginTop={2}>
                <IconButton onClick={handleDelete}>
                    <DeleteIcon color="error" />
                </IconButton>
                <IconButton onClick={onEditClick}>
                    <AddIcon color="primary" />
                </IconButton>
            </Box>
        </Paper>
    );
}

DataTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
};
