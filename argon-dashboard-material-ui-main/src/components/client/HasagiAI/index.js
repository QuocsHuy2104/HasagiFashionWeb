import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, IconButton, Box, Typography, Avatar, Modal } from '@mui/material';
import { Send, Mic } from '@mui/icons-material';
import { styled } from '@mui/system';
import CategoryService from '../../../services/CategoryServices';
import BrandService from '../../../services/BrandServices';
import ProductService from 'services/ProductServices';
import ProductInfo from './Infor/productInfor';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const ChatContentWrapper = styled(Box)(({ theme }) => ({
    maxWidth: '500px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',       // Rounded corners for a clean look
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    margin: 'auto',
    marginTop: '10px'
}));


const Header = styled(Box)(({ theme }) => ({
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    color: '#ffffff',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
}));

const Logo = styled(Typography)(({ theme }) => ({
    marginLeft: '16px',
    fontSize: '24px',
    fontWeight: 'bold',
}));

const MessageContainer = styled(Box)({
    flexGrow: 1,
    overflowY: 'auto', // Luôn cho phép cuộn khi nội dung vượt quá chiều cao
    height: '600px',
    padding: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',

    // Tùy chỉnh thanh cuộn
    '&::-webkit-scrollbar': {
        width: '8px', // Độ rộng của thanh cuộn
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1', // Màu nền của track thanh cuộn
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#C0C0C0', // Màu của thanh cuộn
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#A9A9A9', // Màu của thanh cuộn khi hover
    },
});


const Message = styled(Box)(({ sender }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
    marginBottom: '8px',
}));

const MessageBubble = styled(Typography)(({ sender }) => ({
    maxWidth: '60%',
    padding: '12px',
    borderRadius: '16px',
    color: sender === 'user' ? '#ffffff' : '#000000',
    backgroundColor: sender === 'user' ? '#1976d2' : '#f1f1f1',
    wordBreak: 'break-word',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
}));

const ChatInputContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: theme.palette.divider || 'black',
}));

const StyledIconButton = styled(IconButton)(({ loading }) => ({
    backgroundColor: loading ? '#e0e0e0' : '#1976d2',
    color: '#ffffff',
    borderRadius: '8px',
    '&:hover': {
        backgroundColor: loading ? '#e0e0e0' : '#1565c0',
    },
}));

const API_KEY = 'AIzaSyB2_xVykWy6mMZHoYGtkNAk9x7Ghp20HFA';

function App() {
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    //micro
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [listening, setListening] = useState(false);
    const [timer, setTimer] = useState(null);


    useEffect(() => {
        const welcomeMessage = {
            text: 'Xin chào! Tôi là trợ lý ảo Hasagi, tôi có thể giúp gì cho bạn?',
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString(),
        };
        setMessages([welcomeMessage]);

        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getAllCategories();
                setCategories(response.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await BrandService.getAllBrands();
                setBrands(response.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await ProductService.getAllProducts();
                setProducts(response.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCategories();
        fetchBrands();
        fetchProducts();
    }, []);

    const analyzeQuestion = (text) => {
        const lowerCaseText = text.toLowerCase();
        const matchedCategories = categories.filter(category => lowerCaseText.includes(category.name.toLowerCase()));
        const matchedBrands = brands.filter(brand => lowerCaseText.includes(brand.name.toLowerCase()));
        const matchedProducts = products.filter(product => lowerCaseText.includes(product.name.toLowerCase()));

        let response = '';

        if (matchedCategories.length > 0) {
            response += `Bạn đã hỏi về danh mục: ${matchedCategories.map(c => c.name).join(', ')}! `;
        }
        if (matchedBrands.length > 0) {
            response += `Bạn đã hỏi về thương hiệu: ${matchedBrands.map(b => b.name).join(', ')}! `;
        }
        if (matchedProducts.length > 0) {
            response += `Bạn đã hỏi về sản phẩm: ${matchedProducts.map(p => p.name).join(', ')}! `;
            return { response, products: matchedProducts }; // Trả về thông tin sản phẩm
        }

        return { response, products: [] }; // Trả về danh sách sản phẩm rỗng
    };


    const generateAnswer = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        const userMessage = { text: question, sender: 'user', timestamp: new Date().toLocaleTimeString() };
        setMessages((prev) => [...prev, userMessage]);
        setQuestion('');
        setLoading(true);

        // Phân tích câu hỏi
        const analysisResponse = analyzeQuestion(question);
        if (analysisResponse.response) {
            // If there's a response, respond immediately
            const aiMessage = {
                text: analysisResponse.response,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages((prev) => [...prev, aiMessage]);

            // Display product info if any
            if (analysisResponse.products.length > 0) {
                analysisResponse.products.forEach(product => {
                    const productMessage = {
                        sender: 'ai',
                        timestamp: new Date().toLocaleTimeString(),
                        product: product, // Add product to message
                    };
                    setMessages((prev) => [...prev, productMessage]);
                });
            }
            setLoading(false);
            return; // End function if a response was sent
        }


        // Nếu không có phân tích, tiếp tục gọi API
        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
                method: 'post',
                data: {
                    contents: [{ parts: [{ text: question }] }],
                },
            });

            const aiMessage = {
                text: response.data.candidates[0].content.parts[0].text,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.', sender: 'ai' },
            ]);
        }
        setLoading(false);
    };

    //micro
    useEffect(() => {
        if (transcript) {
            setQuestion(transcript);
            resetTimer(); // Reset timer khi có âm thanh
        }
    }, [transcript]);

    const resetTimer = () => {
        if (timer) {
            clearTimeout(timer); // Xóa timer hiện tại
        }
        const newTimer = setTimeout(() => {
            stopListening(); // Tắt microphone sau 3 giây không có âm thanh
        }, 3000);
        setTimer(newTimer); // Cập nhật timer mới
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
        setListening(false); // Cập nhật trạng thái listening
        clearTimeout(timer); // Xóa timer khi dừng nghe
    };

    const handleMicrophoneToggle = () => {
        if (listening) {
            stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: 'vi-VN' });
            setListening(true); // Cập nhật trạng thái listening
            resetTimer(); // Bắt đầu timer khi bắt đầu nghe
        }
    };


    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    return (
        <>
            <IconButton
                onClick={toggleModal}
                sx={{
                    position: 'fixed',
                    bottom: 70,
                    right: 20,
                    zIndex: 1000,
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                    borderRadius: '50%',
                    padding: 4,
                    width: '50px',
                    height: '50px',
                    '&:hover': {
                        backgroundColor: '#1565c0',
                    },
                }}
            >
                <Avatar
                    alt="Logo"
                    src="https://cdn-icons-png.flaticon.com/128/6231/6231457.png"
                    sx={{ width: 40, height: 40 }}
                />
            </IconButton>

            <Modal open={isModalOpen} onClose={toggleModal} aria-labelledby="chat-modal">
                <ChatContentWrapper>
                    <Header>
                        <Avatar
                            alt="Logo"
                            src="https://cdn-icons-png.flaticon.com/128/8943/8943377.png"
                            sx={{ width: 40, height: 40 }}
                        />
                        <Logo>Chat Bot</Logo>
                    </Header>
                    <MessageContainer>
                        {messages.map((message, index) => (
                            <Message key={index} sender={message.sender}>
                                {message.sender === 'ai' && (
                                    <Avatar
                                        alt="Bot Avatar"
                                        src="https://cdn-icons-png.flaticon.com/128/5226/5226034.png"
                                        sx={{ width: 40, height: 40, marginRight: 1 }}
                                    />
                                )}
                                {message.product ? ( // Nếu có thông tin sản phẩm
                                    <ProductInfo product={message.product} />
                                ) : (
                                    <MessageBubble sender={message.sender}>{message.text}</MessageBubble>
                                )}
                            </Message>
                        ))}
                    </MessageContainer>


                    <ChatInputContainer component="form" onSubmit={generateAnswer}>
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '4px 8px', // Giảm padding để chiều cao nhỏ lại
                                borderRadius: '5px', // Bo góc
                                border: '1px solid #ccc', // Viền xám
                                outline: 'none', // Loại bỏ viền xanh khi chọn
                                fontSize: '14px', // Thu nhỏ font chữ trong input
                                height: '40px', // Điều chỉnh chiều cao
                                boxSizing: 'border-box' // Đảm bảo padding không ảnh hưởng đến kích thước
                            }}
                        />
                        <style>
                            {`
            input[type="text"]::placeholder {
                font-size: 16px; /* Font chữ nhỏ hơn cho placeholder */
                color: #aaa; /* Màu xám nhạt cho placeholder */
            }
        `}
                        </style>

                        <IconButton
                            onClick={handleMicrophoneToggle}
                            color={listening ? 'primary' : 'default'}
                            sx={{
                                backgroundColor: listening ? 'rgba(63, 81, 181, 0.5)' : 'transparent',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                transition: 'background-color 0.3s ease',
                                animation: listening ? 'pulse 1s infinite' : 'none',
                                '&:hover': {
                                    backgroundColor: listening ? 'rgba(63, 81, 181, 0.7)' : 'transparent',
                                },
                            }}
                        >
                            <Mic />
                        </IconButton>

                        <StyledIconButton type="submit" disabled={loading} loading={loading}>
                            {loading ? <CircularProgress size={24} /> : <Send />}
                        </StyledIconButton>
                    </ChatInputContainer>

                </ChatContentWrapper>
            </Modal>

        </>
    );
}

export default App;