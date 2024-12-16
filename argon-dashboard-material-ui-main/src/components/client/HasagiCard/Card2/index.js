import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MuiLink from "@mui/material/Link";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useState } from "react";
import ProductPopup from "components/client/HasagiPopup";

function formatPrice(price) {
    if (!price || typeof price !== "string") {
        return "N/A"; 
    }
    try {
        const parts = price.trim().split("-").map(part =>
            Number(part.trim().replace(/\s/g, "")) 
        );

        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return `${parts[0].toLocaleString("vi-VN")}đ - ${parts[1].toLocaleString("vi-VN")}đ`;
        } else if (parts.length === 1 && !isNaN(parts[0])) {
            return `${parts[0].toLocaleString("vi-VN")}đ`;
        } else {
            return "N/A";
        }
    } catch (error) {
        console.error("Error formatting price:", error);
        return "N/A";
    }
}

function HasagiCard2({ image, name, id, price }) {
    const [hover, setHover] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const handleOpenPopup = () => {
        setSelectedProductId(id);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedProductId(null);
    };

    return (
        <Card
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Image and Name */}
            <MuiLink href={`/ShopDetail?id=${id}`}>
                <ArgonBox
                    mt={1}
                    mx={2}
                    style={{
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ArgonBox
                        component="img"
                        src={image || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'}
                        alt={name || 'No Image Available'}
                        height="475px"
                        width="auto"
                        borderRadius="lg"
                        style={{
                            transition: 'transform 0.3s ease',
                            transform: hover ? 'scale(1.1)' : 'scale(1)',
                            overflow: 'hidden',
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';
                        }}
                    />
                </ArgonBox>

                 <ArgonTypography
                   variant="h5"
                   color="text"
                   mt={2}
                   textAlign="left" // Căn trái tên sản phẩm
                   style={{    
                       whiteSpace: "nowrap",
                       overflow: "hidden",
                       textOverflow: "ellipsis",
                   }}
               >
                   {name}
               </ArgonTypography>


                {/* Price */}
                <ArgonBox display="flex" alignItems="center" justifyContent='center' my={1} mb={3}>
                    <ArgonTypography
                        variant="button"
                        color="error"
                        style={{ fontWeight: 'bold' }}
                    >
                        {formatPrice(price)}
                    </ArgonTypography>
                </ArgonBox>
            </MuiLink>

            {/* Hover Icons */}
            {hover && (
                <>
                    {/* <SearchOutlinedIcon
                        onClick={handleOpenPopup}
                        sx={{
                            width: '1.7em',
                            height: '1.7em',
                            position: 'absolute',
                            top: 17,
                            right: 15,
                            backgroundColor: '#F9F9F9',
                            padding: '5px',
                            borderRadius: '12px',
                            cursor: 'pointer'
                        }}
                    /> */}

                    {/* <ShoppingCartIcon
                        sx={{
                            width: '1.7em',
                            height: '1.7em',
                            position: 'absolute',
                            top: 62,
                            right: 15,
                            backgroundColor: '#F9F9F9',
                            padding: '5px',
                            borderRadius: '12px',
                            cursor: 'pointer'
                        }}
                    /> */}
                </>
            )}

            {/* Product Popup */}
            <ProductPopup open={isPopupOpen} handleClose={handleClosePopup} id={selectedProductId} />
        </Card>
    );
}

HasagiCard2.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    price: PropTypes.string.isRequired,
};

export default HasagiCard2;
