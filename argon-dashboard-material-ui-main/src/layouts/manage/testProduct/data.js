import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'price', headerName: 'Giá', width: 100 },
    { field: 'size.name', headerName: 'Size', width: 130 }, 
    { field: 'color.name', headerName: 'Màu', width: 130 },
    { field: 'quantity', headerName: 'Số lượng', width: 130 },
    { field: 'priceSize', headerName: 'Giá kích cỡ', width: 120 },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 120 }, // Assuming you meant createdAt
];

export default function DataTable({ productDetails, onEditClick, onDeleteClick }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

    const handleSelectionModelChange = (newSelectionModel) => {
        setSelectedRows(newSelectionModel);
    };

    const handleEdit = () => {
        if (selectedRows.length === 1) {
            const selectedProductDT = productDetails.find((productDetail) => productDetail.id === selectedRows[0]);
            onEditClick(selectedProductDT);
        }
    };

    const handleDelete = () => {
        if (selectedRows.length > 0) {
            onDeleteClick(selectedRows);
        }
    };

    console.log('Product Details:', productDetails); // Debugging log

    return (
        <Paper sx={{ height: 400, width: '100%', position: 'relative' }}>
            <DataGrid
                rows={productDetails}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleSelectionModelChange}
                sx={{ border: 0 }}
            />

            {selectedRows.length > 0 && (
                <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                    <IconButton onClick={handleEdit} disabled={selectedRows.length !== 1}>
                        <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </Box>
            )}
        </Paper>
    );
}

DataTable.propTypes = {
    productDetails: PropTypes.array.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
};
