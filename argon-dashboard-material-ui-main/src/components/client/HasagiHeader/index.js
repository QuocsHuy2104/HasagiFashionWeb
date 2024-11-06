import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Input } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import MuiLink from "@mui/material/Link";
import Cookies from 'js-cookie';
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import logo from 'components/client/assets/images/logo-ct-dark.png';
import ArgonAvatar from 'components/ArgonAvatar';
import useCartQuantity from "../HasagiQuantity/useCartQuantity";
import PersonIcon from '@mui/icons-material/Person';
import ReorderIcon from '@mui/icons-material/Reorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { faShoppingCart, faCamera } from '@fortawesome/free-solid-svg-icons';
import CategoriesService from 'services/CategoryServices';
import BrandsService from 'services/BrandServices';
import { jwtDecode } from 'jwt-decode';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputBase from '@mui/material/InputBase';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

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
    const { onSearch } = props;
    const [isHovering, setIsHovering] = React.useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { totalQuantity, fetchTotalQuantity } = useCartQuantity();

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    useEffect(() => {
        fetchTotalQuantity();
    }, [fetchTotalQuantity]);

    const startVoiceSearch = (event) => {
        event.preventDefault();
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'vi-VN';
            recognition.interimResults = false;

            recognition.onstart = () => {
                console.log('Voice recognition started. Speak into the microphone.');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchTerm(transcript);
                onSearch(transcript);

                const utterance = new SpeechSynthesisUtterance(transcript);
                utterance.lang = 'vi-VN';
                window.speechSynthesis.speak(utterance);
            };

            recognition.onerror = (event) => {
                console.error('Error occurred in recognition: ' + event.error);
            };

            recognition.start();
        } else {
            alert('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.');
        }
    };
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


                                    <ArgonBox display="flex" alignItems="center" sx={{ borderBottom: '1px solid #d2d2d2', position: 'relative', flexGrow: 1 }}>
                                        <InputBase
                                            placeholder="Tìm kiếm sản phẩm..."
                                            inputProps={{ 'aria-label': 'search' }}
                                            sx={{ ml: 1, flex: 1 }}
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            aria-label="Search"
                                        />
                                        <button
                                            className="btn btn-outline-secondary rounded-pill"
                                            type="button"
                                            onClick={startVoiceSearch}
                                            style={{
                                                position: 'absolute',
                                                right: 10,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                cursor: 'pointer',
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                opacity: 1,
                                                marginRight: '15px'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faMicrophone} style={{ fontSize: '1.5rem', color: '#333' }} /> {/* Adjust color if needed */}
                                        </button>
                                        <label htmlFor="image-upload" style={{ cursor: 'pointer', marginLeft: '10px' }}>
                                            <FontAwesomeIcon
                                                icon={faCamera}
                                                style={{ fontSize: '1.5rem', color: '#333', cursor: 'pointer', paddingLeft: '10px' }}
                                            />
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="uploads/*"
                                                style={{ display: 'none' }}
                                              
                                            />
                                        </label>
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
                                                <MuiLink href='/History' sx={{ marginLeft: 2 }}>
                                                    <ArgonTypography variant="inherit">Lịch sử mua hàng</ArgonTypography>
                                                </MuiLink>
                                            </ArgonBox>
                                        </ArgonBox>
                                    )}
                                </ArgonBox>


                                <a href="/Cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '10px', textDecoration: 'none', paddingLeft: '20px' }}>
                                    <FontAwesomeIcon icon={faShoppingCart} className="icon" style={{ fontSize: '24px' }} />
                                    {totalQuantity > 0 && (
                                        <span
                                            className="badge bg-primary"
                                            style={{

                                                position: 'absolute',
                                                top: '-5px',
                                                right: '-10px',
                                                backgroundColor: 'orange',
                                                borderRadius: '50%',
                                                padding: '5px 10px',
                                                fontSize: '12px',
                                                color: 'white'
                                            }}>
                                            {totalQuantity}
                                        </span>
                                    )}
                                </a>
                            </ArgonBox>
                        </Toolbar>
                    </AppBar>
                </ElevationScroll>
                <Toolbar />
            </ArgonBox>
        </>
    );
}
Header.propTypes = {
    onSearch: PropTypes.func.isRequired,
};