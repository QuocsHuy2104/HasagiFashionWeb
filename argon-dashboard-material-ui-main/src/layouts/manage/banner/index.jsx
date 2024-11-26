import React, { useState } from "react";
import BannersList from './BannersList';
import AddBanner from './AddBanner';
import Footer from "../../../examples/Footer";
import { Container, Row, Col } from "react-bootstrap";
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Banner() {

    const [bookId, setBannerId] = useState("");

    const getBannerIdHandler = (id) => {
        console.log("The ID of document to be edited: ", id);
        setBannerId(id);  // Sửa lỗi ở đây
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <ToastContainer />
                <ArgonBox mb={5}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" p={3}>
                            <ArgonTypography variant="h6">Manage Banners</ArgonTypography>
                        </ArgonBox>
                        <Container>
                            <Row>
                                <Col>
                                    <AddBanner id={bookId} setBannerId={setBannerId} />
                                </Col>
                            </Row>
                        </Container>

                        <Container>
                            <Row>
                                <Col>
                                    <BannersList getBannerId={getBannerIdHandler} />
                                </Col>
                            </Row>
                        </Container>
                    </Card>
                </ArgonBox>

                <Footer />
            </DashboardLayout>

        </>




    );
}

export default Banner;