import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MuiLink from "@mui/material/Link";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import ArgonBadge from "components/ArgonBadge";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useState } from "react";

function HasagiCard2({ image, name, id, price, sale }) {
    const [hover, setHover] = useState(false);
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
            }}>

            <ArgonBox
                color='white'
                bgColor='error'
                borderRadius='md'
                p={1} shadow='lg'
                sx={{
                    position: 'absolute',
                    top: 15,
                    left: 15,
                    fontSize: '13px'
                }}
            >-{sale}%</ArgonBox>

            <FavoriteBorderIcon
             sx={{
                
                position: 'absolute',
                top: 15,
                right: 15,
                backgroundColor: '#F9F9F9',
                padding: '5px',
                borderRadius: '50%'
            }} />

            {hover && (
                <>
                    <SearchOutlinedIcon
                    
                        sx={{
                            
                            position: 'absolute',
                            top: 60,
                            right: 15,
                            backgroundColor: '#F9F9F9',
                            padding: '5px',
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                    />

                    <ShoppingCartIcon
                    
                        sx={{
                            
                            position: 'absolute',
                            top: 110,
                            right: 15,
                            backgroundColor: '#F9F9F9',
                            padding: '5px',
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                    />
                </>
            )}

            <MuiLink href={`ShopDetails/${id}`} target="_blank" rel="noreferrer">
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

                <ArgonTypography variant="h5" component="p" color="text" my={2}>{name}</ArgonTypography>

                <ArgonBox display="flex" alignItems="center">
                    <ArgonTypography
                        variant="body2"
                        component="p"
                        color="secondary"
                        style={{ textDecoration: 'line-through' }}
                    >
                        {price} VNĐ
                    </ArgonTypography>

                    <ArgonTypography
                        variant="subtitle2"
                        component="p"
                        color="error"
                        style={{ marginLeft: '8px' }}
                    >
                        {price} VNĐ
                    </ArgonTypography>
                </ArgonBox>
            </MuiLink>
        </Card>
    );
}

HasagiCard2.defaultProps = {
    sale: 0
}

HasagiCard2.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    sale: PropTypes.number.isRequired,
};

export default HasagiCard2;
