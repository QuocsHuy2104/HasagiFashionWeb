import React, { useState } from 'react';

const NotFoundPage = () => {
  const [isHovered, setIsHovered] = useState(false); 

  const errorStyle = {
    height: '100vh',
    backgroundColor: '#EBF3FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const imgErrorStyle = {
    width: '100%',
    maxWidth: '1000px',
    marginTop: '-10px', 
  };

  const errorTitleStyle = {
    fontSize: '2.5rem',
    marginTop: '1rem',
    color: '#25396f',
    marginBottom: '0.5rem',
    fontWeight: '700',
    lineHeight: '1.2',
  };

  const textStyle = {
    fontSize: '1.25rem',
    color: '#666',
  };

  const buttonStyle = {
    marginTop: '5px',
    fontSize: '1.3rem',
    color: '#000',
    backgroundColor: '#007bff',
    textDecoration: 'none',
    borderRadius: '50px',
    padding: '10px 25px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    background: 'linear-gradient(45deg, #f55f7d, #f85f73)',
    transform: 'scale(1.05)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)', 
  };

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false); 
  };

  return (
    <div style={errorStyle}>
      <div className="col-md-8 col-12 text-center">
        <img
          style={imgErrorStyle}
          src="https://d3design.vn/admin/assets/images/samples/error-404.png"
          alt="Not Found"
        />
        <h1 style={errorTitleStyle}>Xin lỗi, trang không tìm thấy!</h1>
        <p style={textStyle}>Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm. Có thể bạn đã gõ sai URL? Hãy kiểm tra lại chính tả của bạn.</p>

        <button
          style={isHovered ? buttonHoverStyle : buttonStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={() => window.location.href = '/'} 
        >
         Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
