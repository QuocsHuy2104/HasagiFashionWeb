import React from "react";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import ArgonButton from "components/ArgonButton";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import logo from 'components/client/assets/images/logo.png';
import tamnhin from 'components/client/assets/images/tamnhin.jpg';
import giaohangnhanh from 'components/client/assets/images/giaohangnhanh.jpg';
import doitra from 'components/client/assets/images/doitra.jpg';
import tuvan from 'components/client/assets/images/tuvan.jpg';
import sumenh from 'components/client/assets/images/sumenh.jpg';

const AboutShop = () => {
    return (
        <>
            <HasagiNav />
            <div
                className="container-fluid"
                style={{
                    padding: "4rem 2rem",
                    backgroundColor: "#f4f6f9",
                    minHeight: "100vh",
                    width: "100%",
                }}
            >

                <div
                    className="row justify-content-center"
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        padding: "3rem 2rem",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        marginBottom: "2rem",
                        width: "100%",
                    }}
                >
                    <div className="col-lg-12 text-center">
                        <h2
                            style={{
                                fontSize: "3rem",
                                fontWeight: "700",
                                color: "#333",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Chào mừng đến với Hasagi Fashion
                        </h2>

                        <img
                            src={logo}
                            alt="Hasagi Fashion Logo"
                            style={{
                                maxWidth: "400px",
                                marginBottom: "1.5rem",
                                borderRadius: "8px",
                            }}
                        />

                        <p
                            style={{
                                fontSize: "1.2rem",
                                lineHeight: "1.8",
                                color: "#777",
                                marginBottom: "2rem",
                            }}
                        >
                            Tại Hasagi, chúng tôi không chỉ cung cấp những bộ trang phục thời thượng mà còn mang đến một lối sống đẳng cấp, phản ánh cá tính riêng biệt của mỗi người. Mỗi sản phẩm đều được chăm chút tỉ mỉ, kết hợp giữa chất liệu cao cấp và thiết kế tinh tế, giúp bạn luôn nổi bật và tự tin trong mọi hoàn cảnh. Chúng tôi hiểu rằng thời trang không chỉ là vẻ bề ngoài mà còn là cách thể hiện bản thân, và chính vì vậy, mỗi sản phẩm của Hasagi đều được tạo ra để không chỉ làm bạn hài lòng về mặt thẩm mỹ mà còn là người bạn đồng hành lý tưởng trong cuộc sống hàng ngày. Đến với chúng tôi, bạn sẽ khám phá được những xu hướng mới nhất, phù hợp với mọi lứa tuổi, phong cách và nhu cầu.
                        </p>

                        <a href="/Shop" style={{ textDecoration: 'none' }}>
                            <ArgonButton
                                style={{
                                    width: "50%",
                                    padding: "1.2rem",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    color: "#fff",
                                    backgroundColor: "#ff5722",
                                    border: "none",
                                    borderRadius: "50px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s, transform 0.3s",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#e64a19";
                                    e.target.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "#ff5722";
                                    e.target.style.transform = "scale(1)";
                                }}
                            >
                                Khám Phá Bộ Sưu Tập
                            </ArgonButton>
                        </a>

                    </div>
                </div>

                <div
                    className="row justify-content-center"
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        padding: "3rem 2rem",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        marginBottom: "2rem",
                        width: "100%",
                    }}
                >
                    <div className="col-lg-12 text-center">
                        <h3
                            style={{
                                fontSize: "3rem",
                                fontWeight: "700",
                                color: "#333",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Sứ Mệnh Của Chúng Tôi
                        </h3>
                        <div className="row">
                            <div className="col-lg-6" style={{ paddingRight: "2rem" }}>
                                <p
                                    style={{
                                        fontSize: "1.5rem",
                                        lineHeight: "1.8",
                                        color: "#777",
                                    }}
                                >
                                    Sứ mệnh của chúng tôi là không chỉ mang đến những bộ trang phục đẹp, mà còn truyền tải câu chuyện về sự tự tin và phong cách của mỗi khách hàng. Chúng tôi tận tâm lựa chọn từng thiết kế, chất liệu, và sắc màu, nhằm đem đến trải nghiệm thời trang tuyệt vời nhất. Cam kết của chúng tôi là kết hợp giữa xu hướng thời trang hiện đại và sự tinh tế trong từng chi tiết, mang đến không chỉ sự thoải mái mà còn khẳng định đẳng cấp của bạn.
                                </p>
                            </div>
                            <div className="col-lg-6">
                                <img
                                    src={sumenh}
                                    alt="Sứ Mệnh"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        borderRadius: "8px",
                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="row justify-content-center"
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        padding: "3rem 2rem",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        marginBottom: "2rem",
                        width: "100%",
                    }}
                >
                    <div className="col-lg-12 text-center">
                        <h3
                            style={{
                                fontSize: "3rem",
                                fontWeight: "700",
                                color: "#333",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Tầm Nhìn Của Chúng Tôi
                        </h3>
                        <div className="row">
                            <div className="col-lg-6">
                                <img
                                    src={tamnhin}
                                    alt="Tầm Nhìn"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        borderRadius: "8px",
                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                            </div>
                            <div className="col-lg-6" style={{ paddingRight: "2rem" }}>
                                <p
                                    style={{
                                        fontSize: "1.5rem",
                                        lineHeight: "1.8",
                                        color: "#777",
                                    }}
                                >
                                    Tầm nhìn của chúng tôi là trở thành thương hiệu thời trang hàng đầu tại Việt Nam, luôn cung cấp những sản phẩm chất lượng, mang lại sự thoải mái và tự tin cho khách hàng. Chúng tôi muốn mỗi bộ trang phục từ Hasagi không chỉ là một món đồ, mà là sự thể hiện phong cách và cá tính riêng biệt của mỗi người. Chúng tôi cam kết phát triển bền vững, gắn kết với cộng đồng và không ngừng sáng tạo để đáp ứng nhu cầu ngày càng cao của khách hàng.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                <div
                    className="row justify-content-center"
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        padding: "3rem 2rem",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        marginBottom: "2rem",
                        width: "100%",
                    }}
                >
                    <div className="col-lg-12 text-center">
                        <h3
                            style={{
                                fontSize: "2.5rem",
                                fontWeight: "700",
                                color: "#333",
                                marginBottom: "2rem",
                            }}
                        >
                            Dịch Vụ Đặc Biệt Của Chúng Tôi
                        </h3>
                        <div className="row">
                            <div className="col-md-4">
                                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                                    <img
                                        src={giaohangnhanh}
                                        alt="Giao Hàng Nhanh"
                                        style={{
                                            width: "300px",
                                            height: "300px",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                            marginBottom: "1rem",
                                        }}
                                    />
                                    <h5
                                        style={{
                                            fontSize: "1.4rem",
                                            fontWeight: "600",
                                            color: "#333",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        Giao Hàng Nhanh
                                    </h5>
                                    <p style={{ fontSize: "1rem", color: "#777", lineHeight: "1.5" }}>
                                        Chúng tôi cam kết giao hàng nhanh chóng và tiện lợi.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                                    <img
                                        src={doitra}
                                        alt="Chính Sách Đổi Trả"
                                        style={{
                                            width: "300px",
                                            height: "300px",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                            marginBottom: "1rem",
                                        }}
                                    />
                                    <h5
                                        style={{
                                            fontSize: "1.4rem",
                                            fontWeight: "600",
                                            color: "#333",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        Chính Sách Đổi Trả Dễ Dàng
                                    </h5>
                                    <p style={{ fontSize: "1rem", color: "#777", lineHeight: "1.5" }}>
                                        Nếu sản phẩm không đúng ý, chúng tôi luôn sẵn sàng hỗ trợ đổi trả nhanh chóng.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                                    <img
                                        src={tuvan}
                                        alt="Tư Vấn Thời Trang"
                                        style={{
                                            width: "300px",
                                            height: "300px",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                            marginBottom: "1rem",
                                        }}
                                    />
                                    <h5
                                        style={{
                                            fontSize: "1.4rem",
                                            fontWeight: "600",
                                            color: "#333",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        Tư Vấn Thời Trang Cá Nhân
                                    </h5>
                                    <p style={{ fontSize: "1rem", color: "#777", lineHeight: "1.5" }}>
                                        Chúng tôi cung cấp dịch vụ tư vấn thời trang để bạn có thể chọn lựa được những bộ trang phục phù hợp nhất.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="row justify-content-center"
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        padding: "3rem 2rem",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        marginBottom: "2rem",
                        width: "100%",
                    }}
                >
                    <div className="col-lg-12 text-center">
                        <h3
                            style={{
                                fontSize: "2.5rem",
                                fontWeight: "700",
                                color: "#333",
                                marginBottom: "2rem",
                            }}
                        >
                            Gặp Gỡ Đội Ngũ Chúng Tôi
                        </h3>
                        <div className="row" style={{ justifyContent: "center" }}>
                            <div className="col-md-2 col-sm-6 mb-4">
                                <img
                                    src="uploads/kiet.jpg"
                                    alt="Thành viên 1"
                                    style={{
                                        borderRadius: "50%",
                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "1rem",
                                        height: "200px",
                                        width: "200px",
                                    }}
                                />
                                <h4 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#333" }}>Lê Tuấn Kiệt</h4>
                            </div>
                            <div className="col-md-2 col-sm-6 mb-4">
                                <img
                                    src="uploads/day.jpg"
                                    alt="Thành viên 2"
                                    style={{
                                        borderRadius: "50%",
                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "1rem",
                                        height: "200px",
                                        width: "200px",
                                    }}
                                />
                                <h4 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#333" }}>Nguyễn Vũ Đầy</h4>
                            </div>
                            <div className="col-md-2 col-sm-6 mb-4">
                                <img
                                    src="uploads/khang.jpg"
                                    alt="Thành viên 3"
                                    style={{
                                        borderRadius: "50%",
                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "1rem",
                                        height: "200px",
                                        width: "200px",
                                    }}
                                />
                                <h4 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#333" }}>Nguyễn Hoàng Khang</h4>
                            </div>
                            <div className="col-md-2 col-sm-6 mb-4">
                                <img
                                    src="uploads/lap.jpg"
                                    alt="Thành viên 4"
                                    style={{
                                        borderRadius: "50%",
                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "1rem",
                                        height: "200px",
                                        width: "200px",
                                    }}
                                />
                                <h4 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#333" }}>Trương Công Lập</h4>
                            </div>
                            <div className="col-md-2 col-sm-6 mb-4">
                                <img
                                    src="uploads/khanh.png"
                                    alt="Thành viên 5"
                                    style={{
                                        borderRadius: "50%",
                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "1rem",
                                        height: "200px",
                                        width: "200px",
                                    }}
                                />
                                <h4 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#333" }}>Nguyễn Minh Khanh</h4>
                            </div>
                            <div className="col-md-2 col-sm-6 mb-4">
                                <img
                                    src="uploads/ky.jpg"
                                    alt="Thành viên 6"
                                    style={{
                                        borderRadius: "50%",
                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                                        marginBottom: "1rem",
                                        height: "200px",
                                        width: "200px",
                                    }}
                                />
                                <h4 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#333" }}>Đặng Vĩnh Kỳ</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AboutShop;
