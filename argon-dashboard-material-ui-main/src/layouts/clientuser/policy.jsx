import React from 'react';
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import { LocalShipping, Sync, LocalOffer, VerifiedUser } from '@mui/icons-material';

const Policy = () => {
    const features = [
        {
            title: "Giao hàng nhanh, miễn phí",
            description: "Đơn hàng > 900k hoặc đăng ký tài khoản được giao hàng miễn phí.",
            icon: <LocalShipping />,
            bgColor: "#F9E8E8",
            iconColor: "#D67C7C"
        },
        {
            title: "Trả hàng, Bảo hành",
            description: "Không thích? Trả lại hoặc đổi hàng của bạn miễn phí trong vòng 30 ngày.",
            icon: <Sync />,
            bgColor: "#E8F9F9",
            iconColor: "#7CD6D6"
        },
        {
            title: "Thành viên",
            description: "Ưu đãi theo từng cấp hạng thành viên. Sinh nhật quà tặng thành viên.",
            icon: <LocalOffer />,
            bgColor: "#FEFDD2",
            iconColor: "#54D47F"
        },
        {
            title: "Chính hãng",
            description: "Sản phẩm chính hãng. Được nhập khẩu 100% từ hãng.",
            icon: <VerifiedUser />,
            bgColor: "#E8E9F9",
            iconColor: "#7C7CD6"
        }
    ];

    return (
        <React.Fragment>
            <ArgonBox display="flex" justifyContent="space-around" pt={5}>
                {features.map((feature, index) => (
                    <ArgonBox
                        key={index}
                        borderRadius="50%"
                        border={`1px solid ${feature.iconColor}`}
                        padding="2rem"
                        textAlign="center"
                        width="150px"
                        height="150px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        bgColor={feature.bgColor}
                        style={{
                            transition: 'transform 0.3s, background-color 0.3s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.backgroundColor = feature.iconColor;
                            e.currentTarget.querySelector('.icon').style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor = feature.bgColor;
                            e.currentTarget.querySelector('.icon').style.color = feature.iconColor;
                        }}
                    >
                        <div
                            className="icon"
                            style={{ fontSize: '4rem', color: feature.iconColor, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} // Căn giữa icon
                            aria-label={feature.title}
                        >
                            {feature.icon}
                        </div>
                    </ArgonBox>
                ))}
            </ArgonBox>

            <ArgonBox display="flex" justifyContent="space-around" mt={1}>
                {features.map((feature, index) => (
                    <ArgonBox key={index} textAlign="center">
                        <ArgonTypography
                            variant="h6"
                            fontWeight="bold"
                            color="black"
                            style={{
                                fontFamily: '"Roboto", sans-serif',
                                transition: 'color 0.3s, transform 0.3s', // Hiệu ứng chuyển đổi
                                cursor: 'pointer' // Thay đổi con trỏ khi hover
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'orange'; // Đổi màu chữ khi hover
                                e.currentTarget.style.transform = 'scale(1.1)'; // Tăng kích thước chữ khi hover
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#000'; // Trở lại màu chữ ban đầu (đen) khi không hover
                                e.currentTarget.style.transform = 'scale(1)'; // Trở lại kích thước chữ ban đầu khi không hover
                            }}
                        >
                            {feature.title}
                        </ArgonTypography>
                        <ArgonTypography
                            variant="body2"
                            color="gray"
                            style={{ fontSize: '0.8rem', width: '250px', textAlign: 'center', fontFamily: '"Open Sans", sans-serif' }}
                        >
                            {feature.description}
                        </ArgonTypography>
                    </ArgonBox>
                ))}
            </ArgonBox>

        </React.Fragment>
    );
};

export default Policy;
