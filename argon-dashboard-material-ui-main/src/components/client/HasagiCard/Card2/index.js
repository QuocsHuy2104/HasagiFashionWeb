import { Link } from "react-router-dom"; // Ensure you have this import
import PropTypes from "prop-types";
import Card from "@mui/material/Card";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useState } from "react";

function HasagiCard2({ image, name, id, importPrice, sale }) {
    const [hover, setHover] = useState(false);
    const discountedPrice = (importPrice * (1 - sale / 100)).toFixed(0);

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
            <ArgonBox
                color='white'
                bgColor='error'
                borderRadius='md'
                p={1} shadow='lg'
                sx={{
                    position: 'absolute',
                    top: 15,
                    left: 15,
                    fontSize: '13px',
                     zIndex: '1200'
                }}
            >
                -{sale}%
            </ArgonBox>

            <FavoriteBorderIcon
                sx={{
                    width: '2em',
                    height: '2em',
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    backgroundColor: '#F9F9F9',
                    padding: '5px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                     zIndex: '1200'
                }} 
            />

            {hover && (
                <>
                    <SearchOutlinedIcon
                        sx={{
                            width: '2em',
                            height: '2em',
                            position: 'absolute',
                            top: 60,
                            right: 15,
                            backgroundColor: '#F9F9F9',
                            padding: '5px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                             zIndex: '1200'
                        }}
                    />
                    <ShoppingCartIcon
                        sx={{
                            width: '2em',
                            height: '2em',
                            position: 'absolute',
                            top: 110,
                            right: 15,
                            backgroundColor: '#F9F9F9',
                            padding: '5px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            zIndex: '1200'
                        }}
                    />
                </>
            )}
            <Link to={`/ShopDetail?id=${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ArgonBox
                    mt={2}
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
                        height="480px"
                        width="auto"
                        borderRadius="lg"
                        style={{
                            transition: 'transform 0.3s ease',
                            transform: hover ? 'scale(1.1)' : 'scale(1)',
                            overflow: 'hidden',
                            height: '400px',
                            width: '100%'
                        }}
                    />
                </ArgonBox>

                <ArgonTypography variant="h5" component="p" color="text" my={2}>{name}</ArgonTypography>

                <ArgonBox display="flex" alignItems="center">
                    {sale > 0 && (
                        <>
                            <ArgonTypography
                                variant="body2"
                                component="p"
                                color="secondary"
                                style={{ textDecoration: 'line-through' }}
                            >
                                {importPrice} VNĐ
                            </ArgonTypography>

                            <ArgonTypography
                                variant="subtitle2"
                                component="p"
                                color="error"
                                style={{ marginLeft: '8px' }}
                            >
                                {discountedPrice} VNĐ
                            </ArgonTypography>
                        </>
                    )}
                    {sale === 0 && (
                        <ArgonTypography
                            variant="subtitle2"
                            component="p"
                            color="error"
                        >
                            {importPrice} VNĐ
                        </ArgonTypography>
                    )}
                </ArgonBox>
            </Link>
        </Card>
    );
}

HasagiCard2.defaultProps = {
    sale: 0
};

HasagiCard2.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    importPrice: PropTypes.number.isRequired,
    sale: PropTypes.number.isRequired,
};

export default HasagiCard2;