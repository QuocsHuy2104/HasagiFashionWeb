import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2'; 

const columns = [
    { field: 'name', headerName: 'Thương hiệu', width: 130 },
    {
        field: 'image',
        headerName: 'Hình ảnh',
        width: 150,
        renderCell: (params) => (
            <img src={params.value} alt="Category" style={{ width: 50, height: 50, objectFit: 'cover' }} />
        ),
    },
];

export default function DataTable({ brands, onEditClick, onDeleteClick }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

    const handleSelectionModelChange = (newSelectionModel) => {
        setSelectedRows(newSelectionModel);
    };

    const handleDelete = async () => {
        if (selectedRows.length > 0) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger ml-2",
                },
                buttonsStyling: false,
            });
            swalWithBootstrapButtons
                .fire({
                    title: "Bạn có chắc chắn?",
                    text: "Muốn xóa thương hiệu này không!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Vâng, tôi muốn!",
                    cancelButtonText: "Không!",
                    reverseButtons: true,
                    backdrop: 'rgba(0, 0, 0, 0) left top no-repeat',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await onDeleteClick(selectedRows);
                            Swal.fire({
                                title: "Đã xóa!",
                                text: "Thương hiệu đã được xóa thành công.",
                                icon: "success",
                                backdrop: 'rgba(0, 0, 0, 0)',
                            });
                        } catch (error) {
                            console.error("Có lỗi xảy ra khi xóa!", error);
                            Swal.fire({
                                title: "Lỗi!",
                                text: "Có lỗi xảy ra khi xóa thương hiệu.",
                                icon: "error",
                                backdrop: 'rgba(0, 0, 0, 0)',
                            });
                        }
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal.fire({
                            title: "Đã hủy",
                            text: "Thương hiệu không bị xóa.",
                            icon: "error",
                            backdrop: 'rgba(0, 0, 0, 0)',
                        });
                    }
                });
        }
    };

    const handleEdit = () => {
        if (selectedRows.length === 1) {
            const selectedBrand = brands.find((brand) => brand.id === selectedRows[0]);
            onEditClick(selectedBrand);
        }
    };

    return (
        <Paper sx={{ height: 400, width: '100%', position: 'relative' }}>
            <DataGrid
                rows={brands}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10]}
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
                        <EditIcon brand="dark" />
                    </IconButton>
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon brand="dark" />
                    </IconButton>
                </Box>
            )}
        </Paper>
    );
}

DataTable.propTypes = {
    brands: PropTypes.array.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
};