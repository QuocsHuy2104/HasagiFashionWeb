
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import { Link } from "react-router-dom";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useState } from "react";
import ProductPopup from "components/client/HasagiPopup";

function HasagiCard2({ image, name, id, price, sale = 0 }) {

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
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Link to={`/ShopDetail?id=${id}`}>
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
                        src={image}
                        alt={name}
                        height="275px"
                        width="auto"
                        borderRadius="lg"
                        style={{
                            transition: 'transform 0.3s ease',
                            transform: hover ? 'scale(1.1)' : 'scale(1)',
                            overflow: 'hidden',
                        }}
                    />
                </ArgonBox>

                <ArgonTypography variant="button" component="p" color="text" textAlign="center" mt={2}>  {name} </ArgonTypography>

                <ArgonBox display="flex" alignItems="center" justifyContent='center' my={1}>
                    <ArgonTypography
                        variant="button"
                        color="error"
                        // style={{ textDecoration: 'line-through' }}
                    >
                        {price} VNĐ
                    </ArgonTypography>

                    {/* <ArgonTypography    
                        variant="button"
                        color="error"
                        style={{ marginLeft: '4px' }}
                    >
                        {(() => {
                            const salePercent = parseFloat(sale);
                            if (isNaN(salePercent)) {
                                return "Invalid sale percent";
                            }

                            const prices = price
                                .split('-')
                                .map(p => parseFloat(p.replace(/\s/g, '')));

                            if (prices.length === 1) {
                                // Single price case
                                const salePrice = prices[0] - prices[0] * (salePercent / 100);
                                return `${salePrice.toLocaleString()} VNĐ`;
                            } else if (prices.length === 2) {
                                // Range price case
                                const salePrice1 = prices[0] - prices[0] * (salePercent / 100);
                                const salePrice2 = prices[1] - prices[1] * (salePercent / 100);
                                return `${salePrice1.toLocaleString()} - ${salePrice2.toLocaleString()} VNĐ`;
                            }

                            return "Invalid price format";
                        })()}
                    </ArgonTypography> */}



                </ArgonBox>
            </Link>

            {/* <ArgonBox
                color='white'
                bgColor='error'
                borderRadius='md'
                p={1} shadow='lg'
                sx={{
                    position: 'absolute',
                    top: 15,
                    left: 15,
                    fontSize: '12px'
                }}
            >
                -{sale}%
            </ArgonBox> */}

            {/* <FavoriteBorderIcon
                sx={{
                    width: '1.7em',
                    height: '1.7em',
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    backgroundColor: '#F9F9F9',
                    padding: '5px',
                    borderRadius: '12px'
                }}
            /> */}

            {hover && (
                <>
                    <SearchOutlinedIcon
                        onClick={handleOpenPopup}
                        sx={{
                            width: '1.7em',
                            height: '1.7em',
                            position: 'absolute',
                            top: 57,
                            right: 15,
                            backgroundColor: '#F9F9F9',
                            padding: '5px',
                            borderRadius: '12px',
                            cursor: 'pointer'
                        }}
                    />

                    <ShoppingCartIcon
                        sx={{
                            width: '1.7em',
                            height: '1.7em',
                            position: 'absolute',
                            top: 102,
                            right: 15,
                            backgroundColor: '#F9F9F9',
                            padding: '5px',
                            borderRadius: '12px',
                            cursor: 'pointer'
                        }}
                    />
                </>
            )}
            <ProductPopup open={isPopupOpen} handleClose={handleClosePopup} id={selectedProductId} />
        </Card>
    );
}

HasagiCard2.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    price: PropTypes.string.isRequired,
    sale: PropTypes.number.isRequired,
};

export default HasagiCard2;
