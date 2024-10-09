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
                justifyContent: 'space-between',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}>
            <ArgonBox component='img' src={image} alt={name} />

            <ArgonBox
                color='whtie'
                bgColor='error'
                borderRadius='md'
                py={1} px={2} s
                hadow='lg'
                sx={{
                    position: 'absolute',
                    top: 5,
                    left: 5
                }}
            >-{sale}%</ArgonBox>


            <FavoriteBorderIcon sx={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: '#F9F9F9 '
            }} />

            <SearchOutlinedIcon
                sx={{
                    display: 'none',
                    position: 'absolute',
                    top: 15,
                    right: 5,
                    backgroundColor: '#F9F9F9 '
                }}
            />

            <ShoppingCartIcon
                sx={{
                    display: 'none',
                    position: 'absolute',
                    top: 25,
                    right: 5,
                    backgroundColor: '#F9F9F9 '
                }}
            />


        </Card>
    );
}

HasagiCard2.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
};

export default HasagiCard2;
