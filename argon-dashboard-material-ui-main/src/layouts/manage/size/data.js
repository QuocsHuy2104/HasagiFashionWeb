import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';


const columns = [
    { field: 'name', headerName: 'Size', width: 130 },
];

export default function DataTable({ sizes, onEditClick, onDeleteClick }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

    const handleSelectionModelChange = (newSelectionModel) => {
        setSelectedRows(newSelectionModel);
    };

    const handleDelete = async () => {
        if (selectedRows.length > 0) {
            try {
                await onDeleteClick(selectedRows);
            } catch (error) {
                console.error("Có lỗi xảy ra khi xóa!", error);
            }
        }
    };


    const handleEdit = () => {
        if (selectedRows.length === 1) {
            const selectedSize = sizes.find((size) => size.id === selectedRows[0]);
            onEditClick(selectedSize);
        }
    };

    return (
        <Paper sx={{ height: 400, width: '100%', position: 'relative' }}>
            <DataGrid
                rows={sizes}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                checkboxSelection
                onRowSelectionModelChange={handleSelectionModelChange}
                sx={{
                    "& .MuiDataGrid-footerContainer": {
                        justifyContent: "space-between",
                    },
                    "& .MuiTablePagination-selectLabel": {
                        marginRight: 0,
                    },
                    "& .MuiTablePagination-root": {
                        width: "400px",
                    },
                    "& .MuiInputBase-root": {
                        maxWidth: "60px",
                        marginTop: "-10px",
                    },
                    "& .MuiTablePagination-actions": {
                        display: "flex",
                        alignItems: "center",
                    },
                    "& .MuiSelect-select": {
                        paddingRight: "24px",
                    },
                    border: 0,
                }}
            />

            {selectedRows.length > 0 && (
                <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                    <IconButton onClick={handleEdit} disabled={selectedRows.length !== 1}>
                        <EditIcon category="dark" />
                    </IconButton>
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon category="dark" />
                    </IconButton>
                </Box>
            )}
        </Paper>
    );
}

DataTable.propTypes = {
    sizes: PropTypes.array.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
};