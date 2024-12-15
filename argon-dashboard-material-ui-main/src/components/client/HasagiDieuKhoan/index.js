import React from "react";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";

const TermsOfService = () => {
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
          {/* Header */}
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "#ee4d2d",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            Điều Khoản Dịch Vụ
          </h1>
          <p style={contentStyle}>
            Chào mừng bạn đến với <strong>Hasagi Fashion</strong>! Vui lòng đọc kỹ các điều khoản dịch vụ này trước khi sử dụng trang web. Bằng việc truy cập và sử dụng dịch vụ, bạn đồng ý tuân theo các điều khoản này.
          </p>

          {/* Section 1 */}
          <div style={sectionStyle}>
            <h3 style={titleStyle}>1. Giới Thiệu</h3>
            <p style={contentStyle}>
              Trang web <strong>Hasagi Fashion</strong> cung cấp dịch vụ thương mại điện tử cho các sản phẩm thời trang và phụ kiện. Chúng tôi cam kết mang lại trải nghiệm mua sắm thuận tiện, an toàn và chất lượng cho khách hàng.
            </p>
          </div>

          {/* Section 2 */}
          <div style={sectionStyle}>
            <h3 style={titleStyle}>2. Tài Khoản Người Dùng</h3>
            <p style={contentStyle}>
              - Bạn cần tạo tài khoản hợp lệ để sử dụng đầy đủ các tính năng của trang web, bao gồm đặt hàng, thanh toán và theo dõi đơn hàng.<br />
              - Thông tin tài khoản phải chính xác và được cập nhật đầy đủ. Bạn chịu trách nhiệm bảo mật tài khoản và không chia sẻ thông tin đăng nhập.<br />
              - Nếu phát hiện tài khoản bị xâm nhập, vui lòng thông báo ngay cho chúng tôi.<br />
              - Chúng tôi có quyền đình chỉ hoặc khóa tài khoản nếu phát hiện hành vi vi phạm điều khoản sử dụng.
            </p>
          </div>

          {/* Section 3 */}
          <div style={sectionStyle}>
            <h3 style={titleStyle}>3. Quyền và Nghĩa Vụ của Người Dùng</h3>
            <p style={contentStyle}>
              - Bạn cam kết sử dụng trang web với mục đích hợp pháp, không làm gián đoạn dịch vụ hoặc xâm phạm quyền lợi của người khác.<br />
              - Nghiêm cấm sử dụng phần mềm, mã độc hoặc thực hiện bất kỳ hành vi nào gây thiệt hại đến trang web và người dùng khác.<br />
              - Người dùng không được sử dụng thông tin, hình ảnh trên trang web cho mục đích thương mại khi chưa có sự cho phép từ chúng tôi.
            </p>
          </div>

          {/* Section 4 */}
          <div style={sectionStyle}>
            <h3 style={titleStyle}>4. Đơn Hàng và Thanh Toán</h3>
            <p style={contentStyle}>
              - Đơn hàng chỉ được xác nhận sau khi thanh toán thành công hoặc khi bạn chọn hình thức <strong>Thanh toán khi nhận hàng (COD)</strong>.<br />
              - Phương thức thanh toán bao gồm: <strong>VNPay</strong>, <strong>PayOS</strong> và <strong>COD</strong>.<br />
              - Chúng tôi có quyền hủy đơn hàng khi phát hiện dấu hiệu gian lận hoặc thông tin không hợp lệ.<br />
              - Giá sản phẩm được niêm yết rõ ràng, bao gồm hoặc không bao gồm chi phí vận chuyển và thuế giá trị gia tăng.
            </p>
          </div>

          {/* Section 5 */}
          <div style={sectionStyle}>
            <h3 style={titleStyle}>5. Chính Sách Vận Chuyển, Đổi Trả và Hoàn Tiền</h3>
            <p style={contentStyle}>
              - Đơn hàng sẽ được vận chuyển trong vòng 3-7 ngày làm việc tùy theo khu vực.<br />
              - Khách hàng có quyền đổi/trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi, sai mẫu mã hoặc hư hỏng.<br />
              - Để biết thêm chi tiết, vui lòng xem{" "}
              <a href="/DoiTra" style={linkStyle}>
                Chính sách đổi trả
              </a>{" "}
              và{" "}
              <a href="/BaoMat" style={linkStyle}>
                Chính sách bảo mật
              </a>
              .
            </p>
          </div>

          {/* Section 6 */}
          <div style={sectionStyle}>
            <h3 style={titleStyle}>6. Bảo Mật Thông Tin</h3>
            <p style={contentStyle}>
              - Chúng tôi cam kết bảo mật thông tin khách hàng và tuân thủ các quy định về bảo vệ dữ liệu.<br />
              - Thông tin của bạn chỉ được sử dụng để xử lý đơn hàng và cải thiện dịch vụ.<br />
              - Hasagi Fashion sẽ không chia sẻ thông tin cá nhân của bạn cho bên thứ ba khi chưa có sự đồng ý.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>7. Bản Quyền và Sở Hữu Trí Tuệ</h3>
            <p style={contentStyle}>
              - Mọi nội dung trên trang web bao gồm hình ảnh, văn bản, thiết kế và logo đều thuộc sở hữu của Hasagi Fashion.
              <br />
              - Nghiêm cấm sao chép, sử dụng hoặc phân phối nội dung mà không có sự đồng ý bằng văn bản của chúng tôi.
            </p>
          </div>

          {/* Section 7 */}
          <div style={sectionStyle}>
            <h3 style={titleStyle}>8. Thay Đổi Điều Khoản Dịch Vụ</h3>
            <p style={contentStyle}>
              - Chúng tôi có quyền thay đổi các điều khoản và điều kiện dịch vụ để phù hợp với quy định pháp luật và hoạt động kinh doanh.<br />
              - Các thay đổi sẽ được cập nhật trên trang web và thông báo đến người dùng.
            </p>
          </div>

          {/* Section 8 */}
          <div style={sectionStyle}>
            <h3 style={titleStyle}>9. Liên Hệ và Hỗ Trợ</h3>
            <p style={contentStyle}>
              Mọi câu hỏi hoặc yêu cầu hỗ trợ, vui lòng liên hệ với chúng tôi qua:<br />
              - Email: <strong style={{ color: "#ee4d2d" }}>hasagifashion@gmail.com</strong><br />
              - Hotline: <strong style={{ color: "#ee4d2d" }}>1900 1234</strong><br />
              - Hoặc truy cập trang{" "}
              <a href="/Contact" style={linkStyle}>
                Liên hệ với chúng tôi
              </a>
              .
            </p>
          </div>

          {/* Footer Message */}
          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              color: "#888",
              fontSize: "0.9rem",
            }}
          >
            <p>Cảm ơn bạn đã lựa chọn và tin tưởng dịch vụ của Hasagi Fashion!</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Inline Styles
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

const linkStyle = {
  textDecoration: "none",
  color: "#ee4d2d",
  fontWeight: "600",
};

export default TermsOfService;