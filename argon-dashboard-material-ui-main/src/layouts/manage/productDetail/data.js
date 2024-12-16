import React, { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ImageService from 'services/ImageServices';
import AddIcon from '@mui/icons-material/Add';
import ImageUploader from "./uploadImage";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

export default function DataGridDemo({ items, onEdit, onDelete }) {
    const [anchorEl, setAnchorEl] = useState({});
    const [rows, setRows] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [currentProductDetailId, setCurrentProductDetailId] = useState(null);

    const refreshRowsWithImages = async () => {
        const updatedRows = await Promise.all(
            items.map(async (item) => {
                let imgList = [];
                try {
                    const response = await ImageService.getByProductDetailId(item.id);
                    imgList = response.data.map((element) => ({
                        id: element.id,
                        url: element.url,
                    }));
                } catch (error) {
                    console.error(`Error fetching images for item ID ${item.id}:`, error);
                }

                return {
                    id: item.id,
                    imgList,
                    quantity: item.quantity,
                    price: item.price,
                    priceSize: item.priceSize,
                    colorsDTO: item.colorsDTO?.name || 'N/A',
                    sizesDTOResponse: item.sizesDTOResponse?.name || 'N/A',
                    subDescription: item.subDescription || 'N/A',
                    createDate: item.createDate,
                    createBy: item.createBy || 'N/A',
                };
            })
        );
        setRows(updatedRows);
    };

    const refreshImages = async () => {
        if (!currentProductDetailId) return;
        try {
            const response = await ImageService.getByProductDetailId(currentProductDetailId);
            const images = response.data.map((image) => ({
                id: image.id,
                url: image.url,
            }));
            setCurrentImages(images);
        } catch (error) {
            console.error('Error refreshing images:', error);
        }
    };

    const handleModalOpen = (images, productDetailId) => {
        setCurrentImages(images);
        setCurrentProductDetailId(productDetailId);
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setCurrentImages([]);
        setCurrentProductDetailId(null);
    };

    const handleClick = (event, id) => {
        setAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
    };

    const handleClose = (id) => {
        setAnchorEl((prev) => ({ ...prev, [id]: null }));
    };

    const handleUploadComplete = async (urls) => {
        try {
            if (urls.length > 0) {
                const promises = urls.map((url) => {
                    const data = {
                        url: url,
                        productDetailId: currentProductDetailId,
                    };
                    return ImageService.create(data);
                });

                await Promise.all(promises);

                toast.success('Uploaded images successfully');
                await refreshRowsWithImages();
                await refreshImages();
            }
        } catch (error) {
            console.error('Error updating image list', error);
            toast.error('Failed to update image list');
        }
    };


    const handleRemoveImage = async (imageId) => {
        try {
            await ImageService.deleteImage(imageId);
            toast.success('Removed image successfully');
            await refreshRowsWithImages();
            await refreshImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Failed to remove image');
        }
    };

    useEffect(() => {
        refreshRowsWithImages();
    }, [items]);

    const columns = [
        {
            field: 'imgList',
            headerName: 'Hình ảnh',
            width: 250,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        marginTop: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleModalOpen(params.value, params.row.id)}
                >
                    {params.value && params.value.length > 0 ? (
                        <>
                            {params.value.slice(0, 2).map((img, index) => (
                                <img
                                    key={index}
                                    src={img.url}
                                    alt={`Product ${index}`}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                    }}
                                />
                            ))}
                            {params.value.length > 2 && (
                                <span style={{ color: 'gray', marginLeft: '4px' }}>...</span>
                            )}
                        </>
                    ) : (
                        <AddIcon fontSize="large" />
                    )}
                </Box>
            ),
        },
        { field: 'quantity', headerName: 'Số lượng', width: 150, editable: true },
        { field: 'price', headerName: 'Giá sản phẩm', width: 150, editable: true },
        { field: 'priceSize', headerName: 'Giá size', width: 150, editable: true },
        { field: 'colorsDTO', headerName: 'Màu sắc', sortable: false },
        { field: 'sizesDTOResponse', headerName: 'Kích cỡ', sortable: false },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Thao tác',
            width: 100,
            getActions: (params) => {
                const isOpen = Boolean(anchorEl[params.id]);
                const popoverId = isOpen ? `simple-popover-${params.id}` : undefined;

                return [
                    <div key={`popover-${params.id}`}>
                        <Button
                            aria-describedby={popoverId}
                            onClick={(event) => handleClick(event, params.id)}
                        >
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
                                    <ListItemButton>
                                        <GridActionsCellItem
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
                                    <ListItemButton>
                                        <GridActionsCellItem
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
                    </div>,
                ];
            },
        },
    ];

    return (
        <>
            <Box sx={{ height: 'auto', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5]}
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

            <Modal open={openModal} onClose={handleModalClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        Hình ảnh
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {currentImages.map((img) => (
                            <div
                                key={img.id}
                                style={{
                                    position: "relative",
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src={img.url}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                                <IconButton
                                    onClick={() => handleRemoveImage(img.id)}
                                    style={{
                                        position: "absolute",
                                        top: "0px",
                                        right: "0px",
                                        zIndex: 1,
                                        color: "#fff",
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        ))}
                    </Box>
                    <ImageUploader
                        onUploadComplete={handleUploadComplete}
                        productDetailId={currentProductDetailId}
                    />
                </Box>
            </Modal>
        </>
    );
}

DataGridDemo.propTypes = {
    items: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};