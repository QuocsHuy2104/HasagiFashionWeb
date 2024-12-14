import React from "react";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";

const ReturnPolicy = () => {
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
            Chính Sách Đổi Trả
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
            Hasagi Fashion cam kết mang đến trải nghiệm mua sắm hài lòng nhất. Chúng tôi hỗ trợ đổi trả sản phẩm trong một số trường hợp cụ thể như sau:
          </p>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>1. Thời Gian Áp Dụng Đổi Trả</h3>
            <p style={contentStyle}>
              - Thời gian áp dụng đổi trả sản phẩm là trong vòng{" "}
              <strong style={{ color: "#ee4d2d" }}>7 ngày</strong> kể từ ngày nhận hàng.
              <br />
              - Quá thời gian trên, chúng tôi sẽ không giải quyết yêu cầu đổi trả sản phẩm.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>2. Điều Kiện Đổi Trả</h3>
            <p style={contentStyle}>
              - Sản phẩm phải còn <strong>nguyên tem, nhãn mác</strong> và chưa qua sử dụng.
              <br />
              - Sản phẩm không bị hư hỏng, dơ bẩn, hoặc có mùi lạ do lỗi của khách hàng.
              <br />
              - Đổi trả chỉ áp dụng cho sản phẩm bị <strong>lỗi từ nhà sản xuất</strong> hoặc giao nhầm hàng.
              <br />
              - Sản phẩm phải kèm hóa đơn hoặc thông tin xác nhận mua hàng.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>3. Các Trường Hợp Không Hỗ Trợ Đổi Trả</h3>
            <p style={contentStyle}>
              - Sản phẩm nằm trong danh mục <strong>khuyến mãi hoặc giảm giá</strong> đặc biệt.
              <br />
              - Sản phẩm bị hư hỏng do <strong>khách hàng sử dụng sai cách</strong>.
              <br />
              - Sản phẩm không còn đầy đủ phụ kiện hoặc mất hóa đơn mua hàng.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>4. Quy Trình Đổi Trả</h3>
            <p style={contentStyle}>
              - Bước 1: Liên hệ với bộ phận chăm sóc khách hàng qua email:{" "}
              <strong style={{ color: "#ee4d2d" }}>hasagifashion@gmail.com</strong> hoặc gọi hotline:{" "}
              <strong style={{ color: "#ee4d2d" }}>0398948675</strong>.
              <br />
              - Bước 2: Gửi sản phẩm cần đổi trả về địa chỉ của chúng tôi:
              <br />
              <em>Hasagi Fashion - Toà nhà FPT Polytechnic, đường số 22, phường Thường Thạnh, quận Cái Răng, TP Cần Thơ</em>
              <br />
              - Bước 3: Chờ xác nhận từ bộ phận kiểm tra chất lượng. Thời gian xử lý trong vòng{" "}
              <strong>3-5 ngày làm việc</strong>.
              <br />
              - Bước 4: Sản phẩm sẽ được đổi mới hoặc hoàn tiền theo yêu cầu của khách hàng.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>5. Chi Phí Đổi Trả</h3>
            <p style={contentStyle}>
              - Miễn phí đổi trả đối với các trường hợp <strong>lỗi từ nhà sản xuất</strong> hoặc giao nhầm hàng.
              <br />
              - Các trường hợp đổi trả khác, khách hàng vui lòng thanh toán chi phí vận chuyển.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}>6. Câu Hỏi và Liên Hệ</h3>
            <p style={contentStyle}>
              Nếu bạn có bất kỳ câu hỏi nào về chính sách đổi trả, vui lòng liên hệ với chúng tôi qua:
              <br />
              - Email: <strong style={{ color: "#ee4d2d" }}>hasagifashion@gmail.com</strong>
              <br />
              - Hotline: <strong style={{ color: "#ee4d2d" }}>0398948675</strong>
              <br />
              - Hoặc truy cập phần{" "}
              <a
                href="/Contact"
                style={{ textDecoration: "none", color: "#ee4d2d" }}
              >
                Liên hệ với chúng tôi
              </a>
              .
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
              Hasagi Fashion luôn sẵn sàng hỗ trợ để mang lại trải nghiệm mua sắm tốt nhất cho bạn.
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

export default ReturnPolicy;
