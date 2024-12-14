import React from "react";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import MuiLink from "@mui/material/Link";
import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn, FaTiktok } from 'react-icons/fa';
import { Container } from "@mui/material";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

const Footer = () => {
    return (
        <ArgonBox
            sx={{
                backgroundImage: 'url("https://bizweb.dktcdn.net/100/493/370/themes/940719/assets/footers2_background.jpg?1713464283843")',
                backgroundSize: 'cover',
                backgroundPosition: '100% 100%',
                // Added paddingTop here
            }}>
            <ArgonBox mx={20}>
                <ArgonBox pt='5rem'>
                    <ArgonBox
                        display='flex'
                        flexWrap='wrap'
                        justifyContent='flex-start'
                        alignItems='flex-start'
                        borderBottom='1px solid #ededed'
                        pb='5rem'
                        sx={{
                            margin: {
                                md: '0 -10px 0 -10px'
                            }
                        }}
                    >
                        <ArgonBox width='25%'
                            sx={{
                                padding: {
                                    md: '0 10px'
                                }
                            }}>
                            <MuiLink href='/' sx={{ marginBottom: '15px', maxWidth: '50%', display: 'block' }}>
                                <ArgonBox
                                    component='img'
                                    src='https://bizweb.dktcdn.net/100/493/370/themes/940719/assets/footers2_one_logo.png?1713464283843'
                                    alt='Logo'
                                    width='100%' />
                            </MuiLink>
                            <ArgonTypography variant='button' color='secondary' sx={{ maxWidth: '85%', fontSize: '15px', lineHeight: '1.7rem', margin: '0' }}>F1GENZ SHOES luôn cam kết, đảm bảo đưa sản phẩm trực tiếp từ nhà sản xuất đến tay người dùng và kiểm soát được chất lượng để đáp ứng được nhu cầu ngày càng cao của khách hàng. Tất cả các sản phẩm tại F1GENZ SHOES đều có nguồn gốc xuất xứ rõ ràng, chất lượng.</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox width='22.5%'
                            sx={{
                                padding: {
                                    md: '0 10px'
                                }
                            }}>
                            <ArgonTypography variant='h4' mb='17px' display='flex' justifyContent='space-between' alignItems='center'>Liên hệ</ArgonTypography>
                            <ArgonBox>
                                <ArgonTypography variant='button' color='secondary' sx={{ maxWidth: '85%', fontSize: '15px', lineHeight: '1.7rem', margin: '0' }}>
                                    CSKH: <MuiLink>0398948675</MuiLink><br />
                                    Email: hasagifashion@gmail.com<br />
                                    Từ 7h00 – 22h00 các ngày từ thứ 2 đến Chủ nhật<br />
                                </ArgonTypography>
                            </ArgonBox>
                        </ArgonBox>

                        <ArgonBox width='15%'
                            sx={{
                                padding: {
                                    md: '0 10px'
                                }
                            }}>
                            <ArgonTypography variant='h4' mb='17px' display='flex' justifyContent='space-between' alignItems='center'>Về chúng tôi</ArgonTypography>
                            <ArgonTypography variant='button' color='secondary' sx={{ maxWidth: '85%', fontSize: '15px', lineHeight: '1.7rem', margin: '0' }}>
                                <MuiLink href='/introduce'>Gioi Thieu</MuiLink><br />
                                <MuiLink href='/DoiTra'>Chinh sach doi tra</MuiLink><br />
                                <MuiLink href='/BaoMat'>Chinh sach bao mat</MuiLink><br />
                                <MuiLink href='/DieuKhoan'>Dieu khoan dich vu</MuiLink><br />
                            </ArgonTypography>
                        </ArgonBox>

                        <ArgonBox width='15%'
                            sx={{
                                padding: {
                                    md: '0 10px'
                                }
                            }}>
                            <ArgonTypography variant='h4' mb='17px' display='flex' justifyContent='space-between' alignItems='center'>Doanh Mục</ArgonTypography>
                            <ArgonTypography variant='button' color='secondary' sx={{ maxWidth: '85%', fontSize: '15px', lineHeight: '1.7rem', margin: '0' }}>
                                <MuiLink href='/shop'>Sản Phẩm</MuiLink><br />
                                <MuiLink href='/policy'>Áo Sơ Mi</MuiLink><br />
                                <MuiLink href='/security'>Áo POLO</MuiLink><br />
                                <MuiLink href='/service'>Thương Hiệu GUCCI</MuiLink><br />
                            </ArgonTypography>
                        </ArgonBox>

                        <ArgonBox width='22.5%'
                            sx={{
                                padding: {
                                    md: '0 10px'
                                }
                            }}>
                            <ArgonTypography variant='h4' mb='17px' display='flex' justifyContent='space-between' alignItems='center'>Liên hệ với chúng tôi</ArgonTypography>
                            <ArgonTypography variant='button' color='secondary' sx={{ maxWidth: '85%', fontSize: '15px', lineHeight: '1.7rem', margin: '0' }}>
                                Luôn cập nhật tất cả các hành động mà chúng tôi đã lưu cho tất cả khách hàng của mình.
                            </ArgonTypography>
                            <ArgonBox display='flex' justifyContent='flex-start' alignItems='center'>
                                <MuiLink href='/shop'>
                                    <ArgonBox width={30} height={30} component='img' src='https://file.hstatic.net/200000588277/file/facebook__6__53aaa8d352524d3eb025af5203eaa437_icon.png' alt='Facebook' />
                                </MuiLink>
                                <MuiLink href='/shop'>
                                    <ArgonBox width={30} height={30} mx={1} component='img' src='https://file.hstatic.net/200000588277/file/youtube__5__4f04522e10494557a651f53a33ad4d76_icon.png' alt='Facebook' />
                                </MuiLink>
                                <MuiLink href='/shop'>
                                    <ArgonBox width={30} height={30} component='img' src='https://file.hstatic.net/200000588277/file/tik-tok_d85bb4e7468c43ac9ed5437649b7405c_icon.png' alt='Facebook' />
                                </MuiLink>
                                <MuiLink href='/shop'>
                                    <ArgonBox width={30} height={30} mx={1} component='img' src='https://file.hstatic.net/200000588277/file/instagram__3__7de3ebbce1f24003b516ca6c1d7c24d5_icon.png' alt='Facebook' />
                                </MuiLink>
                            </ArgonBox>
                        </ArgonBox>
                    </ArgonBox>
                </ArgonBox>

                <ArgonBox display='flex' justifyContent='space-between' alignItems='center' py='2rem'>
                    <ArgonBox>
                        <ArgonTypography variant='button'>
                            © 2024 - Bản quyền thuộc về
                            <MuiLink href='/' mx={1}>HASAGHIFASHION</MuiLink>
                        </ArgonTypography>
                    </ArgonBox>
                    <ArgonBox display='flex' justifyContent='space-start' alignItems='center'>
                        <ArgonBox>
                            <MuiLink href='/'>
                                <ArgonBox component='img' src='https://bizweb.dktcdn.net/100/493/370/themes/940719/assets/shop_payment_item_image_1.png?1713464283843' alt='payment' />
                            </MuiLink>
                        </ArgonBox>
                        <ArgonBox mx={1}>
                            <MuiLink href='/'>
                                <ArgonBox component='img' src='https://bizweb.dktcdn.net/100/493/370/themes/940719/assets/shop_payment_item_image_2.png?1713464283843' alt='payment' />
                            </MuiLink>
                        </ArgonBox>

                        <ArgonBox>
                            <MuiLink href='/'>
                                <ArgonBox component='img' src='https://bizweb.dktcdn.net/100/493/370/themes/940719/assets/shop_payment_item_image_3.png?1713464283843' alt='payment' />
                            </MuiLink>
                        </ArgonBox>

                        <ArgonBox mx={1}>
                            <MuiLink href='/'>
                                <ArgonBox component='img' src='https://bizweb.dktcdn.net/100/493/370/themes/940719/assets/shop_payment_item_image_4.png?1713464283843' alt='payment' />
                            </MuiLink>
                        </ArgonBox>
                        <ArgonBox>
                            <MuiLink href='/'>
                                <ArgonBox component='img' src='https://bizweb.dktcdn.net/100/493/370/themes/940719/assets/shop_payment_item_image_5.png?1713464283843' alt='payment' />
                            </MuiLink>
                        </ArgonBox>
                    </ArgonBox>

                </ArgonBox>
            </ArgonBox>
        </ArgonBox >
    )
}

export default Footer;