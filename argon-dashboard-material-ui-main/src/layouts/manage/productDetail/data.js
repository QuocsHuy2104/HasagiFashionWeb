import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import ProductDetailService from 'services/ProductDetailServices';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'quantity',
        headerName: 'Số lượng',
        width: 150,
        editable: true,
    },
    {
        field: 'price',
        headerName: 'Giá sản phẩm',
        width: 150,
        editable: true,
    },
    {
        field: 'createDate',
        headerName: 'Ngày thêm',
        type: 'dateTime',
        width: 180,
        editable: false,
        valueFormatter: ({ value }) => new Date(value).toLocaleString(), // Format timestamp
    },
    {
        field: 'createBy',
        headerName: 'Người thêm',
        sortable: false,
        width: 160,
    },
];

export default function DataGridDemo({ id }) {
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const resp = await ProductDetailService.getAllByProductId(id);
                setItems(resp.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProductDetails();
    }, [id]);

    const rows = items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        createDate: item.createDate,
        createBy: item.createBy,
    }));

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}
