import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import MuiLink from "@mui/material/Link";
import Cookies from 'js-cookie';
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import logo from 'components/client/assets/images/logo-ct-dark.png';
import ArgonAvatar from 'components/ArgonAvatar';

import PersonIcon from '@mui/icons-material/Person';
import ReorderIcon from '@mui/icons-material/Reorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import CategoriesService from 'services/CategoryServices';
import BrandsService from 'services/BrandServices';
import { jwtDecode } from 'jwt-decode';

function ElevationScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return children
        ? React.cloneElement(children, {
            elevation: trigger ? 6 : 0,
            style: {
                backgroundColor: trigger ? '#fff' : 'transparent',
                boxShadow: trigger ? '0px 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.3s ease',
            },
        })
        : null;
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

export default function Header(props) {
    const [isHovering, setIsHovering] = React.useState(false);
    const user = Cookies.get('user');
    var position = false;
    if (user === null) position = false;
    else
        try {
            const token = jwtDecode(user);
            if (token.scope !== 'USER')
                position = true;
        } catch (error) {
            position = false;
            console.error(error);
        }

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    const fetchData = async () => {
        const [categories, brands] = await Promise.all([
            CategoriesService.getAllCategories()
        ])
    }

    return (
        <>
            <ArgonBox height='110px' sx={{ borderBottom: '1px solid #d2d2d2' }}>
                <CssBaseline />
                <ElevationScroll {...props}>
                    <AppBar >
                        <Toolbar>
                            <ArgonBox display="flex" justifyContent="space-between" height="110px" mx={16} alignItems="center" width="100%">
                                {/* Logo Section */}
                                {position ? (
                                    <MuiLink href='/dashboard'>
                                        <ArgonBox display="flex" alignItems="center">
                                            <ArgonAvatar src={logo} alt="Avatar" variant="rounded" size="lg" p={3} />
                                            <ArgonTypography variant="h5" ml={2}>HasagiFashion</ArgonTypography>
                                        </ArgonBox>
                                    </MuiLink>
                                ) : (
                                    <ArgonBox display="flex" alignItems="center">
                                        <ArgonAvatar src={logo} alt="Avatar" variant="rounded" size="lg" p={3} />
                                        <ArgonTypography variant="h5" ml={2}>HasagiFashion</ArgonTypography>
                                    </ArgonBox>
                                )}

                                <ArgonBox
                                    display="flex"
                                    justifyContent="center"
                                    alignItems='center'
                                    height='110px'
                                    mx={6}
                                    sx={{
                                        flexGrow: 1,
                                        display: { xs: 'none', sm: 'flex' } // Hidden on extra small screens
                                    }}
                                >
                                    <MuiLink href="/" sx={{ paddingRight: 3 }}>
                                        <ArgonTypography variant="h5">TRANG CHỦ</ArgonTypography>
                                    </MuiLink>

                                    <MuiLink href="/Shop" sx={{ paddingRight: 3 }}>
                                        <ArgonTypography variant="h5">SẢN PHẨM</ArgonTypography>
                                    </MuiLink>

                                    <MuiLink href="/new" sx={{ paddingRight: 3 }}>
                                        <ArgonTypography variant="h5">MỚI</ArgonTypography>
                                    </MuiLink>

                                    <MuiLink href="/ao-thun" sx={{ paddingRight: 3 }}>
                                        <ArgonTypography variant="h5">ÁO THUN NAM NỮ</ArgonTypography>
                                    </MuiLink>

                                    {/* Icons with Hover */}
                                    <ArgonBox
                                        display="flex"
                                        px={2} height={110}
                                        alignItems="center"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        style={{ cursor: 'pointer' }}>
                                        <ReorderIcon sx={{ fontSize: 30 }} />
                                        <ExpandMoreIcon sx={{ fontSize: 30 }} />
                                        {isHovering && (
                                            <ArgonBox
                                                sx={{
                                                    position: 'absolute',
                                                    boxShadow: '0px 4px 20px rgb(0, 0, 0, 0.2)',
                                                    borderTop: '2px solid red',
                                                    top: '85%',
                                                    left: 0,
                                                    p: 2,
                                                }}
                                                width='100%'
                                                bgColor='secondary'
                                                variant='gradient'
                                            >

                                                <ArgonBox
                                                    display="grid"
                                                    gridTemplateColumns="repeat(5, 1fr)"
                                                    gap={2}
                                                >
                                                    <ArgonBox p={2} color='white' display='flex' flexDirection='column' >
                                                        <MuiLink href='#'>Áo Thun Trơn</MuiLink>
                                                        <MuiLink href='#'>Áo Thun Cổ Tròn</MuiLink>
                                                        <MuiLink href='#'>Áo Thun In Hình</MuiLink>
                                                    </ArgonBox>
                                                    <ArgonBox p={2} border="1px solid lightgray" color='white' display='flex' flexDirection='column'>
                                                        <MuiLink href='#'>Áo POLO Trơn</MuiLink>
                                                        <MuiLink href='#'>Áo POLO In Hình</MuiLink>
                                                        <MuiLink href='#'>Áo POLO dáng rộng</MuiLink>
                                                        <MuiLink href='#'>Áo POLO dáng vừa</MuiLink>
                                                    </ArgonBox>
                                                    <ArgonBox p={2} border="1px solid lightgray" color='white' display='flex' flexDirection='column'>
                                                        <ArgonTypography>Column 3</ArgonTypography>
                                                    </ArgonBox>
                                                    <ArgonBox p={2} border="1px solid lightgray" color='white' display='flex' flexDirection='column'>
                                                        <ArgonTypography>Column 4</ArgonTypography>
                                                    </ArgonBox>
                                                    <ArgonBox p={2} border="1px solid lightgray" color='white' display='flex' flexDirection='column'>
                                                        <ArgonTypography>Column 5</ArgonTypography>
                                                    </ArgonBox>
                                                </ArgonBox>
                                            </ArgonBox>
                                        )}
                                    </ArgonBox>
                                </ArgonBox>

                                <ArgonBox>
                                    {user == null ? (
                                        <ArgonBox display="flex" flexDirection="column" alignItems="center">
                                            <PersonIcon />
                                            <ArgonBox display='flex' justifyContent='space-evenly' alignItems='center' mt={1}>
                                                <MuiLink href='/authentication/sign-in' sx={{ marginRight: 1 }}>
                                                    <ArgonTypography variant="inherit">Đăng Nhập</ArgonTypography>
                                                </MuiLink>

                                                <MuiLink href='/authentication/sign-up'>
                                                    <ArgonTypography variant="inherit">Đăng Ký</ArgonTypography>
                                                </MuiLink>
                                            </ArgonBox>
                                        </ArgonBox>
                                    ) : (
                                        <ArgonBox display="flex" flexDirection="column" alignItems="center">
                                            <PersonIcon />
                                            <ArgonBox display='flex' justifyContent='space-evenly' alignItems='center' mt={1}>
                                                <MuiLink href='/dashboard'>
                                                    <ArgonTypography variant="inherit">Tài Khoản</ArgonTypography>
                                                </MuiLink>
                                            </ArgonBox>
                                        </ArgonBox>
                                    )}
                                </ArgonBox>

                                <ArgonBox p={3}>
                                    <MuiLink href='/cart'>
                                        <ShoppingCartIcon fontSize="large" />
                                    </MuiLink>
                                </ArgonBox>

                            </ArgonBox>
                        </Toolbar>
                    </AppBar>
                </ElevationScroll>
                <Toolbar />
            </ArgonBox>
        </>
    );
}
