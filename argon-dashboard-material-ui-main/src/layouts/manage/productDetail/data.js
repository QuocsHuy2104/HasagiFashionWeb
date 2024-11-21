import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns = [
    {
        field: 'price', headerName: 'Giá gốc', width: 130, editable: true,
        renderCell: (params) => (
            <span>{formatCurrency(params.row.price)}</span>
        ),
    },
    { field: 'quantity', headerName: 'Số lượng', width: 110, editable: true },
    {
        field: 'color',
        headerName: 'Màu sắc',
        width: 100,
        valueGetter: (params) => params?.row?.colorsDTOResponse?.name || 'Không có',
        renderCell: (params) => (
            <span>{params.row.colorsDTOResponse?.name || 'Không có'}</span>
        ),
    },
    {
        field: 'size',
        headerName: 'Kích thước',
        width: 110,
        valueGetter: (params) => params?.row?.sizesDTOResponse?.name || 'Không có',
        renderCell: (params) => (
            <span>{params.row.sizesDTOResponse?.name || 'Không có'}</span>
        ),
    },
    {
        field: 'priceSize', headerName: 'Giá size', width: 130, editable: true,
        renderCell: (params) => (
            <span>{formatCurrency(params.row.priceSize)}</span>
        ),
    },
    {
        field: 'createDate',
        headerName: 'Ngày thêm',
        width: 120,
        renderCell: (params) => (
            <span style={{ whiteSpace: 'pre-line' }}>{formatDate(params.value)}</span>
        ),
    },
    { field: 'createBy', headerName: 'Người thêm', width: 130 },
    {
        field: 'sellingPrice',
        headerName: 'Giá bán',
        width: 140,
        renderCell: (params) => (
            <span>{formatCurrency(params.row.price + params.row.priceSize)}</span>
        ),
    },
];

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatCurrency = (value) => {
    if (value == null) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
};

export default function DataTable({ productDetails, onEditClick }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedProductDT, setSelectedProductDT] = useState(null);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

    const handleSelectionModelChange = (newSelectionModel) => {
        setSelectedRows(newSelectionModel);

        if (newSelectionModel.length === 1) {
            const selectedProduct = productDetails.find((productDetail) => productDetail.id === newSelectionModel[0]);
            setSelectedProductDT(selectedProduct);
            onEditClick(selectedProduct); // Truyền selectedProduct vào onEditClick
        } else {
            setSelectedProductDT(null);
            onEditClick(null); // Gọi onEditClick với null khi không có hàng nào được chọn
        }
    };

    useEffect(() => {
        // Chỉ kiểm tra "All rows are selected" nếu không có hàng nào được chọn hoặc có nhiều hơn một hàng được chọn
        if (selectedRows.length > 0 && selectedRows.length < productDetails.length) {
            console.log("Not all rows are selected");
        } else if (selectedRows.length === productDetails.length) {
            console.log("All rows are selected");
        }
    }, [selectedRows, productDetails.length]);

    return (
        <Paper sx={{ height: 400, width: '100%', position: 'relative' }}>
            <DataGrid
                rows={productDetails}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                checkboxSelection
                onRowSelectionModelChange={handleSelectionModelChange}
                pageSizeOptions={[5, 10, 20]}
                sx={{ border: 0 }}
            />
        </Paper>
    );
}

DataTable.propTypes = {
    productDetails: PropTypes.array.isRequired,
    onEditClick: PropTypes.func.isRequired,
};