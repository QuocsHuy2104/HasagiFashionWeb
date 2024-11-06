import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ProductDetailService from 'services/ProductDetailServices';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

export default function DataGridDemo({ items, onEdit, onDelete }) {
    const [anchorEl, setAnchorEl] = React.useState({});

    const handleClick = (event, id) => {
        setAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
    };

    const handleClose = (id) => {
        setAnchorEl((prev) => ({ ...prev, [id]: null }));
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'quantity', headerName: 'Số lượng', width: 150, editable: true },
        { field: 'price', headerName: 'Giá sản phẩm', width: 150, editable: true },
        { field: 'priceSize', headerName: 'Giá size', width: 150, editable: true },
        { field: 'colorsDTO', headerName: 'Color', sortable: false },
        { field: 'sizesDTOResponse', headerName: 'Size', sortable: false },
        {
            field: 'createDate',
            headerName: 'Ngày thêm',
            type: 'dateTime',
            width: 180,
            editable: false,
            valueFormatter: ({ value }) => new Date(value).toLocaleString()
        },
        { field: 'createBy', headerName: 'Người thêm', sortable: false, width: 160 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => {
                const isOpen = Boolean(anchorEl[params.id]);
                const popoverId = isOpen ? `simple-popover-${params.id}` : undefined;

                return [
                    <div key={`popover-${params.id}`}>
                        <Button aria-describedby={popoverId} onClick={(event) => handleClick(event, params.id)}>
                            <MoreVertIcon />
                        </Button>
                        <Popover
                            id={popoverId}
                            open={isOpen}
                            anchorEl={anchorEl[params.id]}
                            onClose={() => handleClose(params.id)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <List sx={{ bgcolor: 'background.paper' }}>
                                <ListItem key={`list-item-edit-${params.id}`} disablePadding>
                                    <ListItemButton key={`list-item-button-edit-${params.id}`}>
                                        <GridActionsCellItem
                                            key={`grid-action-edit-${params.id}`}
                                            icon={<EditCalendarIcon />}
                                            label="Edit"
                                            onClick={() => {
                                                onEdit(params.row);
                                                handleClose(params.id); 
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={`list-item-remove-${params.id}`} disablePadding>
                                    <ListItemButton key={`list-item-button-remove-${params.id}`}>
                                        <GridActionsCellItem
                                            key={`grid-action-remove-${params.id}`}
                                            icon={<DeleteForeverIcon />}
                                            label="Remove"
                                            onClick={() => {
                                                onDelete(params.row);
                                                handleClose(params.id);
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Popover>
                    </div>
                ];
            },
        },
    ];

    const rows = items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        priceSize: item.priceSize,
        colorsDTO: item.colorsDTO.name,
        sizesDTOResponse: item.sizesDTOResponse.name,
        subDescription: item.subDescription,
        createDate: item.createDate,
        createBy: item.createBy,
    }));

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: { showQuickFilter: true },
                }}
            />
        </Box>
    );
}

DataGridDemo.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            priceSize: PropTypes.number.isRequired,
            createDate: PropTypes.string.isRequired,
            createBy: PropTypes.string.isRequired,
            colorsDTO: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            sizesDTOResponse: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            subDescription: PropTypes.string.isRequired,
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
