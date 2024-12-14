import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MuiLink from "@mui/material/Link";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import ArgonBadge from "components/ArgonBadge";

import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useState } from "react";

function HasagiCard({ image, category, description, id, action, price, month }) {

    const [hovered, setHovered] = useState(false);

    const today = new Date();
    const month2 = today.getMonth() + 1;

    return (
        <Card
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <IconButton
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 20,
                    display: hovered ? 'block' : 'none', // Show on hover
                    zIndex: 1
                }}
                color="info"
            >
                <FavoriteIcon />
            </IconButton>

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
                {action.type === "internal" ? (
                    <Link to={action.route}>
                        <ArgonBox
                            component="img"
                            src={image}
                            alt={description}
                            width="auto"
                            height="275px"
                            borderRadius="lg"
                            style={{
                                transition: 'transform 0.3s ease',
                                transform: hovered ? 'scale(1.1)' : 'scale(1)',
                            }}
                        />
                    </Link>
                ) : (
                    <MuiLink href={action.route} target="_blank" rel="noreferrer">
                        <ArgonBox
                            component="img"
                            src={image}
                            alt={description}
                            height="275px"
                            width="auto"
                            borderRadius="lg"
                            style={{
                                transition: 'transform 0.3s ease',
                                transform: hovered ? 'scale(1.1)' : 'scale(1)',
                                overflow: 'hidden',
                            }}
                        />
                    </MuiLink>
                )}
            </ArgonBox>

            <ArgonBox pb={3} px={3} pt={2} style={{ flexGrow: 1 }}>
                {category && (
                    <ArgonTypography
                        variant="caption"
                        color={category.color}
                        textTransform="uppercase"
                        fontWeight="medium"
                        textGradient
                    >
                        {category.label}
                    </ArgonTypography>
                )}

                {month2 === month ? <ArgonBadge badgeContent="New" size="sm" container /> : <></>}

                <ArgonTypography variant="h5" component="p" color="text" my={2}>
                    {description.substring(0, 40)} ...
                </ArgonTypography>

                <ArgonBox display="flex" alignItems="center">
                    <ArgonTypography
                        variant="body2"
                        component="p"
                        color="Secondary"
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

                {id && (
                    <ArgonButton variant="outlined" color="info" size="large" startIcon={<ShoppingCartIcon />} fullWidth>
                        Add to cart
                    </ArgonButton>
                )}
            </ArgonBox>
        </Card>
    );
}

HasagiCard.defaultProps = {
    category: false,
    id: false,
};

HasagiCard.propTypes = {
    image: PropTypes.string.isRequired,
    category: PropTypes.oneOfType([
        PropTypes.shape({
            color: PropTypes.oneOf([
                "primary",
                "secondary",
                "info",
                "success",
                "warning",
                "error",
                "dark",
            ]).isRequired,
            label: PropTypes.string.isRequired,
        }),
        PropTypes.bool,
    ]),
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    action: PropTypes.shape({
        type: PropTypes.oneOf(["external", "internal"]).isRequired,
        route: PropTypes.string.isRequired,
    }).isRequired,
    price: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
};

export default HasagiCard;
