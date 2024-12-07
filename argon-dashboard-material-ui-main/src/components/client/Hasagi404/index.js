import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const NotFoundPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => setIsHovered(true);
  const handleMouseOut = () => setIsHovered(false);

  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: '#EBF3FF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'column',
        px: 2,
      }}
    >
      <Box
        component="img"
        src="https://d3design.vn/admin/assets/images/samples/error-404.png"
        alt="Not Found"
        sx={{
          width: '100%',
          maxWidth: '1000px',
          mt: -1,
        }}
      />
      <Typography
        variant="h4"
        sx={{
          mt: 2,
          color: '#25396f',
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        Xin lỗi, trang không tìm thấy!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: '1.25rem',
          color: '#666',
          mt: 1,
          mb: 2,
        }}
      >
        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm. Có thể bạn đã gõ sai URL? Hãy kiểm tra lại chính tả của bạn.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={() => (window.location.href = '/')}
        sx={{
          mt: 2,
          fontSize: '1rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1,
          borderRadius: '25px',
          padding: '10px 25px',
          bgcolor: isHovered
            ? 'linear-gradient(45deg, #f55f7d, #f85f73)'
            : '#007bff',
          transition: 'all 0.3s ease',
          boxShadow: isHovered
            ? '0 12px 24px rgba(0, 0, 0, 0.2)'
            : '0 6px 12px rgba(0, 0, 0, 0.1)',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        Về trang chủ
      </Button>
    </Box>
  );
};

export default NotFoundPage;
