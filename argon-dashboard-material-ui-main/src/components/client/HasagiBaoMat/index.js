import React from "react";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";

const PrivacyPolicy = () => {
  return (
    <>
      <HasagiNav />
      <div
        style={{
          fontFamily: "'Arial', sans-serif",
          backgroundColor: "#f5f5f5",
          padding: "2rem 0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "#ee4d2d",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            Chính Sách Bảo Mật
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#555",
              textAlign: "center",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}
          >
            <strong>Hasagi Fashion</strong> cam kết bảo vệ thông tin cá nhân của khách hàng và tuân thủ các quy định pháp lý nhằm mang đến trải nghiệm mua sắm an toàn và tiện lợi.
          </p>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>1. Thông Tin Thu Thập</h3>
            <p style={contentStyle}>
              - Thông tin cá nhân: <strong>Họ tên, email, số điện thoại, địa chỉ giao hàng</strong> khi bạn tạo tài khoản hoặc đặt hàng.
              <br />
              - Thông tin giao dịch: <strong>Lịch sử mua hàng</strong>, phương thức thanh toán và thông tin vận chuyển.
              <br />
              - Thông tin tương tác: Đánh giá sản phẩm, phản hồi dịch vụ, và lịch sử truy cập trang web.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>2. Mục Đích Sử Dụng Thông Tin</h3>
            <p style={contentStyle}>
              - Xử lý đơn hàng, giao hàng và cung cấp các dịch vụ hỗ trợ khách hàng.
              <br />
              - Cung cấp thông tin về các chương trình <strong>khuyến mãi</strong>, sản phẩm mới hoặc mã giảm giá.
              <br />
              - Cải thiện dịch vụ và nâng cao trải nghiệm mua sắm trên website.
              <br />
              - Đảm bảo quyền lợi khách hàng khi có tranh chấp hoặc yêu cầu hỗ trợ.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>3. Bảo Mật Thông Tin Khách Hàng</h3>
            <p style={contentStyle}>
              - Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin khách hàng khỏi rủi ro mất mát, truy cập trái phép hoặc tiết lộ sai mục đích.
              <br />
              - Thông tin chỉ được chia sẻ với các đối tác liên quan như <strong>đơn vị vận chuyển</strong> hoặc nhà cung cấp dịch vụ thanh toán nhằm hoàn thành giao dịch.
              <br />
              - Chúng tôi không bán hoặc trao đổi thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>4. Quyền Lợi Của Khách Hàng</h3>
            <p style={contentStyle}>
              Khách hàng có các quyền sau:
              <br />
              - Yêu cầu <strong>kiểm tra, chỉnh sửa hoặc xóa</strong> thông tin cá nhân đã cung cấp.
              <br />
              - Từ chối nhận thông tin quảng cáo qua email hoặc tin nhắn.
              <br />
              - Liên hệ qua email:{" "}
              <strong style={{ color: "#ee4d2d" }}>hasagifashion@gmail.com</strong> để thực hiện các yêu cầu trên.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>5. Thay Đổi Chính Sách Bảo Mật</h3>
            <p style={contentStyle}>
              Chính sách bảo mật này có thể được cập nhật theo từng thời kỳ để phù hợp với yêu cầu phát triển và quy định pháp luật. Chúng tôi sẽ thông báo rõ ràng trên trang web khi có bất kỳ thay đổi nào.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>6. Câu Hỏi và Liên Hệ</h3>
            <p style={contentStyle}>
              Nếu bạn có bất kỳ câu hỏi, mối quan tâm hoặc ý kiến nào về chính sách bảo mật của chúng tôi, vui lòng truy cập vào phần{" "}
              <strong>
                <a
                  href="/Contact"
                  style={{ textDecoration: "none", color: "#ee4d2d" }}
                >
                  Liên hệ với chúng tôi
                </a>
              </strong>{" "}
              và điền vào biểu mẫu liên hệ.
              <br />
              Chúng tôi giữ quyền thực hiện các thay đổi trong chính sách này. Mọi thay đổi sẽ được thông báo và cập nhật tại trang web này.
            </p>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              color: "#888",
              fontSize: "0.9rem",
            }}
          >
            <p>
              Mọi thắc mắc và yêu cầu xin vui lòng liên hệ với{" "}
              <strong style={{ color: "#ee4d2d" }}>Hasagi Fashion</strong>.
            </p>
            <p style={{ marginTop: "0.5rem" }}>Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi!</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const sectionStyle = {
  marginBottom: "1.5rem",
  borderBottom: "1px solid #eee",
  paddingBottom: "1rem",
};

const titleStyle = {
  fontSize: "1.2rem",
  fontWeight: "600",
  color: "#333",
  marginBottom: "0.5rem",
};

const contentStyle = {
  fontSize: "1rem",
  color: "#555",
  lineHeight: "1.6",
};

export default PrivacyPolicy;