import React from "react";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import MuiLink from "@mui/material/Link";
import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn, FaTiktok } from 'react-icons/fa';
import { Container } from "@mui/material";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

const Coupon = () => {
    return (
        <>
            {/* Coupon */}
            <ArgonBox
                borderTop='1px solid #ccc'
                mt={8}
                sx={{
                    backgroundImage: 'url("https://file.hstatic.net/200000306687/file/news-latter-background_70d641e978834763851df1abe46d64df.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    padding: '30px 0 50px !important',
                    width: '100%',
                    zIndex: 2,
                }}
            >
                <ArgonBox mx={20}>
                    <ArgonBox pt='50px' display='flex' alignItems='center' justifyContent='center' flexWrap='wrap'>
                        <ArgonBox width='50%'>
                            <ArgonTypography variant='h2' mb={3} sx={{ fontSize: '4rem' }}>
                                Nhận ưu đãi và coupon mới nhất!
                            </ArgonTypography>
                            <ArgonTypography variant='subtitle2' mb={2}>Chúng tôi cam kết không lộ thông tin của bạn</ArgonTypography>

                            <ArgonBox component='form' role='form' display='flex' justifyContent='space-between' alignItems='center'>
                                <ArgonBox width='70%' me={2}>
                                    <ArgonInput type='email' placeholder='Nhập email của bạn!' />
                                </ArgonBox>
                                <ArgonBox width='25%'>
                                    <ArgonButton variant="outlined" type='submit' color="warning" >Nhận ưu đãi</ArgonButton>
                                </ArgonBox>
                            </ArgonBox>

                            <ArgonTypography variant='subtitle2' color='secondary' mb={2}>Nhận ngay coupon giảm 
                                <ArgonTypography variant='button' color='secondary' mx={1}>15%</ArgonTypography>
                                 khi đăng ký ngay
                            </ArgonTypography>
                        </ArgonBox>

                        <ArgonBox width='50%'>
                            <ArgonBox
                                component='img'
                                src='https://bizweb.dktcdn.net/100/493/370/themes/940719/assets/home-newletter-image.png?1713464283843'
                                alt='Image Footer'
                                mt='-100px'
                            />
                        </ArgonBox>
                    </ArgonBox>
                </ArgonBox>
            </ArgonBox>
        </>
    )
}

export default Coupon;