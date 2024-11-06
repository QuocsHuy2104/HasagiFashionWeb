import React, { useState } from 'react';

function ChatBoxComponent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: inputMessage, type: 'user' }]);
      setInputMessage('');

      const botResponse = 'Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ phản hồi sớm nhất có thể.';
      setMessages((prevMessages) => [...prevMessages, { text: botResponse, type: 'bot' }]);
    }
  };

  const handleAutoQuestionClick = (question) => {
    setMessages((prevMessages) => [...prevMessages, { text: question, type: 'user' }]);
    
    let botResponse;
    switch (question) {
      case 'Làm thế nào để đăng ký tài khoản?':
        botResponse = 'Để đăng ký tài khoản, bạn hãy nhấp vào nút "Đăng ký" ở góc phải trên cùng và điền thông tin cần thiết.';
        break;
      case 'Thời gian giao hàng dự kiến là bao lâu?':
        botResponse = 'Thời gian giao hàng dự kiến là từ 3-5 ngày làm việc tùy vào địa chỉ giao hàng của bạn.';
        break;
      case 'Sản phẩm này có chính sách đổi trả không?':
        botResponse = 'Có, chúng tôi áp dụng chính sách đổi trả trong vòng 7 ngày kể từ ngày nhận hàng. Vui lòng đọc chi tiết trên trang "Chính sách đổi trả".';
        break;
      case 'Hình thức thanh toán nào được chấp nhận?':
        botResponse = 'Chúng tôi chấp nhận các hình thức thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, và thanh toán khi nhận hàng (COD).';
        break;
      case 'Tôi có thể kiểm tra trạng thái đơn hàng ở đâu?':
        botResponse = 'Bạn có thể kiểm tra trạng thái đơn hàng trong mục "Đơn hàng của tôi" sau khi đăng nhập vào tài khoản.';
        break;
      default:
        botResponse = 'Cảm ơn bạn đã gửi câu hỏi. Chúng tôi sẽ phản hồi sớm nhất có thể.';
    }
  
    setMessages((prevMessages) => [...prevMessages, { text: botResponse, type: 'bot' }]);
  };

  const autoQuestions = [
    'Làm thế nào để đăng ký tài khoản?',
    'Thời gian giao hàng dự kiến là bao lâu?',
    'Sản phẩm này có chính sách đổi trả không?',
    'Hình thức thanh toán nào được chấp nhận?',
    'Tôi có thể kiểm tra trạng thái đơn hàng ở đâu?'
  ];

  return (
    <div>
      <button
        onClick={() => setIsChatOpen((prev) => !prev)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        💬
      </button>

      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '400px',
          maxHeight: '500px',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{ margin: 0, color: 'white',  alignItems: 'center' }}>HasagiShopFashion</h4>
            <button onClick={() => setIsChatOpen(false)} style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer'
            }}>✖</button>
          </div>
          <div style={{
            flex: '1',
            padding: '10px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.type === 'user' ? '#007bff' : '#f1f1f1',
                color: msg.type === 'user' ? 'white' : 'black',
                borderRadius: '5px',
                padding: '10px',
                maxWidth: '100%',
                wordWrap: 'break-word',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s',
              }}>
                {msg.text}
              </div>
            ))}
            <div style={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              {autoQuestions.map((question, index) => (
                <button key={index} onClick={() => handleAutoQuestionClick(question)} style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  marginTop: '5px'
                }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleSendMessage} style={{
            display: 'flex',
            padding: '10px',
            borderTop: '1px solid #ccc',
            backgroundColor: '#f9f9f9'
          }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              style={{
                flex: '1',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginRight: '10px',
                transition: 'border-color 0.3s',
                outline: 'none',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#007bff'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
            />
            <button type="submit" style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBoxComponent;
