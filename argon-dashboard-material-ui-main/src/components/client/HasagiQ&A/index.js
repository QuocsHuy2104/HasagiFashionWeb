import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import ChatBot from "components/client/HasagiChatBot";

const faqData = [
  {
    question: 'Sản phẩm thời trang tại Hasagi có đảm bảo chất lượng không?',
    answer: (
      <>
        <p>1. Các sản phẩm thời trang tại Hasagi được chọn lọc kỹ lưỡng từ các thương hiệu uy tín, đảm bảo chất lượng tốt nhất cho khách hàng.</p>
        <p>2. Mỗi sản phẩm đều có thông tin chi tiết về chất liệu, size, và hướng dẫn bảo quản để bạn có thể lựa chọn phù hợp.</p>
        <p>3. Chúng tôi cam kết mang đến sản phẩm thời trang đúng với mô tả và hình ảnh trên website.</p>
      </>
    ),
  },
  {
    question: 'Tôi có thể thử sản phẩm trước khi mua không?',
    answer: (
      <p>
        Hiện tại, Hasagi không hỗ trợ thử đồ trực tiếp, nhưng bạn có thể tham khảo bảng size chi tiết và mô tả sản phẩm để chọn lựa chính xác nhất.
      </p>
    ),
  },
  {
    question: 'Tôi có thể đổi trả sản phẩm nếu không vừa size không?',
    answer: (
      <p>
        Được, bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm không vừa size hoặc không như mong đợi. Tuy nhiên, sản phẩm cần giữ nguyên tình trạng ban đầu, chưa qua sử dụng.
      </p>
    ),
  },
  {
    question: 'Các sản phẩm thời trang tại Hasagi có được bảo hành không?',
    answer: (
      <p>
        Sản phẩm thời trang của Hasagi không có chính sách bảo hành, nhưng chúng tôi cam kết hỗ trợ khách hàng trong việc giải quyết các vấn đề liên quan đến chất lượng sản phẩm.
      </p>
    ),
  },
  {
    question: 'Sản phẩm của Hasagi có giao hàng quốc tế không?',
    answer: (
      <p>
        Hiện tại, Hasagi chỉ cung cấp dịch vụ giao hàng trong nước. Tuy nhiên, chúng tôi đang mở rộng và sẽ sớm hỗ trợ giao hàng quốc tế.
      </p>
    ),
  },
  {
    question: 'Có chương trình giảm giá nào cho khách hàng thường xuyên không?',
    answer: (
      <p>
        Có, Hasagi thường xuyên có các chương trình ưu đãi đặc biệt cho khách hàng đăng ký nhận thông tin từ chúng tôi. Bạn cũng có thể nhận mã giảm giá khi tham gia các chương trình khuyến mãi của cửa hàng.
      </p>
    ),
  },
];

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const containerStyle = {
    position: 'relative',
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  };
  

  const headerStyle = {
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    letterSpacing: '1px',
  };

  const itemStyle = {
    borderBottom: '1px solid #ececec',
    padding: '20px 0',
    transition: 'background-color 0.3s ease',
  };

  const questionStyle = (isHovered) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: '600',
    color: isHovered ? '#ff6b6b' : '#444',
    transition: 'color 0.3s, transform 0.3s',
    padding: '10px 15px',
    borderRadius: '8px',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#f7f7f7',
    },
  });

  const answerStyle = {
    marginTop: '15px',
    fontSize: '17px',
    color: '#555',
    lineHeight: '1.8',
    padding: '10px 15px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    transition: 'background-color 0.3s ease',
  };

  const iconStyle = {
    fontSize: '24px',
    color: '#ff6b6b',
    transition: 'transform 0.3s',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '30px',
    animation: 'zoomIn 0.3s ease-in-out',
  };

  const bgStyle = {
    backgroundImage: 'url(https://png.pngtree.com/png-clipart/20230821/original/pngtree-faq-or-frequently-asked-questions-for-website-picture-image_8148409.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '50px 0',
    color: 'white',
  };

  return (
    <>
      <HasagiNav />
      <div style={bgStyle}>
        <div style={containerStyle}>
          <h2 style={headerStyle}>Câu hỏi thường gặp</h2>
          <img
            src="https://png.pngtree.com/png-vector/20220615/ourmid/pngtree-faq-or-frequently-asked-questions-for-website-png-image_5085618.png"
            alt="FAQ"
            style={imageStyle}
          />
          <div>
            {faqData.map((item, index) => (
              <div
                key={index}
                style={itemStyle}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div
                  style={questionStyle(hoverIndex === index)}
                  onClick={() => toggleQuestion(index)}
                >
                  {item.question}
                  {activeIndex === index ? (
                    <AiOutlineMinus style={{ ...iconStyle, transform: 'rotate(180deg)' }} />
                  ) : (
                    <AiOutlinePlus style={iconStyle} />
                  )}
                </div>
                {activeIndex === index && <div style={answerStyle}>{item.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ChatBot />
    </>
  );
};

export default FAQAccordion;
