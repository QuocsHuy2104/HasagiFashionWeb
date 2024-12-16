import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CategoryService from '../../../services/CategoryServices';
import BrandService from '../../../services/BrandServices';
import ProductService from '../../../services/ProductServices';
import VoucherService from '../../../services/VoucherServices';
import { CircularProgress, IconButton, Box, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';

function Gemini() {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const chatContainerRef = useRef(null);
    const [isVoiceInput, setIsVoiceInput] = useState(false);

    useEffect(() => {
        if (isChatOpen && !hasGreeted) {
            const timer = setTimeout(() => {
                const greetingMessage = "Xin chào bạn, Chào mừng bạn đến với shop thời trang phụ kiện HASAGI. Bạn có câu hỏi gì cho mình không?";
                setChatHistory(prevHistory => [
                    ...prevHistory,
                    { type: 'ai', text: greetingMessage }
                ]);
                setHasGreeted(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isChatOpen, hasGreeted]);

    const getCategoryData = async () => {
        const response = await CategoryService.getAllCategoriesUS();
        return response?.data || [];
    };

    const getBrandData = async () => {
        const response = await BrandService.getAllBrandsUS();
        return response?.data || [];
    };

    const getProductData = async () => {
        const response = await ProductService.getAllProductsUS();
        return response?.data || [];
    };


    const getVoucherData = async () => {
        const response = await VoucherService.getAllVouchersUS();
        return response?.data || [];
    };


    const termsAndConditions = {
        introduction: "Các điều khoản áp dụng khi mua sắm tại shop Hasagi.",
        orderPolicy: "Khách hàng cần cung cấp thông tin chính xác. Đơn hàng chỉ được xác nhận khi có thông báo.",
        paymentPolicy: "Chúng tôi chấp nhận thanh toán trực tiếp khi nhận hàng, qua ví VNPay.",
        returnPolicy: "Đổi trả trong vòng 7 ngày, sản phẩm còn nguyên tem mác.",
        privacyPolicy: "Cam kết bảo mật thông tin cá nhân khách hàng.",
        contact: {
            email: "hasagifashion@gmail.com",
            phone: "0917465863",
            address: "49 Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ, VietNam"
        }
    };


    const generateAIResponse = async (question) => {
        setLoading(true);
        try {
            // Lấy dữ liệu từ các API
            const categories = await getCategoryData();
            const brands = await getBrandData();
            const products = await getProductData();
            const vouchers = await getVoucherData();

            // Kiểm tra trùng lặp câu hỏi
            const lastQuestion = chatHistory[chatHistory.length - 1]?.text;
            if (lastQuestion && lastQuestion === question) {
                setChatHistory((prevHistory) => [
                    ...prevHistory,
                    { type: "ai", text: "Bạn vừa hỏi câu này rồi. Cần hỗ trợ gì thêm không?" }
                ]);
                setLoading(false);
                return;
            }

            // Kiểm tra các từ khóa trong câu hỏi
            const keywords = ['sản phẩm', 'phiếu giảm giá', 'danh mục', 'thương hiệu', 'chi tiết sản phẩm'];
            let shouldSuggest = false;
            let keywordCounts = {};  // Đảm bảo khai báo và sử dụng keywordCounts

            // Đếm số lần xuất hiện từ khóa trong câu hỏi
            keywords.forEach(keyword => {
                if (question.toLowerCase().includes(keyword)) {
                    keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
                    if (keywordCounts[keyword] > 3) {
                        shouldSuggest = true;
                    }
                }
            });

            // Xác định câu chào
            let greeting = "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?";
            if (question.toLowerCase().includes("xin chào") || question.toLowerCase().includes("chào")) {
                greeting = "Chào bạn! Có câu hỏi nào tôi có thể giúp bạn không?";
            }

            // Xây dựng prompt cho AI
            const prompt = `
            Bạn là trợ lý ảo của shop Hasagi. Dưới đây là dữ liệu nội bộ của shop, bạn chỉ được sử dụng các thông tin này để trả lời câu hỏi.
        
            Dữ liệu nội bộ:
            - **Danh mục sản phẩm**: ${JSON.stringify(categories)}.
            - **Thương hiệu**: ${JSON.stringify(brands)}.
            - **Sản phẩm**: ${JSON.stringify(products)}.
            - **Voucher**: ${JSON.stringify(vouchers)}.
            - **Điều khoản & chính sách**: 
                - Giới thiệu: ${termsAndConditions.introduction}.
                - Chính sách đặt hàng: ${termsAndConditions.orderPolicy}.
                - Chính sách thanh toán: ${termsAndConditions.paymentPolicy}.
                - Chính sách đổi trả: ${termsAndConditions.returnPolicy}.
                - Chính sách bảo mật: ${termsAndConditions.privacyPolicy}.
                - Liên hệ: Email: ${termsAndConditions.contact.email}, SĐT: ${termsAndConditions.contact.phone}, Địa chỉ: ${termsAndConditions.contact.address}.
        
            Câu hỏi: "${question}"
        
            Hướng dẫn trả lời:
            1. Chỉ sử dụng dữ liệu nội bộ để trả lời.
            2. Nếu câu hỏi không thuộc phạm vi dữ liệu, hãy xin lỗi khách hàng và yêu cầu họ đặt câu hỏi cụ thể hơn.
            3. Nếu câu hỏi liên quan đến chính sách, danh mục, thương hiệu, sản phẩm hoặc voucher, hãy cung cấp thông tin chính xác từ dữ liệu.
            4. Đối với các câu hỏi không rõ ràng, hãy gợi ý cách khách hàng có thể tìm kiếm thông tin từ shop.
            5. Trả lời bằng ngôn ngữ tiếng Việt.
            6. Hãy giữ phong cách giao tiếp thân thiện và tự nhiên, giống như một trợ lý ảo thân thiện.
        
            Chào hỏi: ${greeting}
            `;

            const API_KEY = 'AIzaSyCrDIwFVBDHE1ZDBDuzjPUClS6KicbLa7o';
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
                { contents: [{ parts: [{ text: prompt }] }] }
            );

            const aiAnswer =
                response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Xin lỗi, tôi không thể xử lý câu hỏi của bạn ngay bây giờ. Vui lòng thử lại sau.";

            let finalAnswer = aiAnswer;
            if (shouldSuggest) {
                finalAnswer += "\n\nCó vẻ như bạn đang tìm kiếm thông tin về một số sản phẩm hoặc chính sách. Bạn có thể truy cập <a href='/shop'>trang sản phẩm</a> của chúng tôi để tìm kiếm thêm chi tiết.";
            }

            // Chuyển đổi URL trong câu trả lời thành thẻ <a> HTML
            finalAnswer = convertTextToLinks(finalAnswer);

            // Cập nhật lịch sử trò chuyện
            setChatHistory((prevHistory) => [
                ...prevHistory,
                { type: "ai", text: finalAnswer }
            ]);

            let currentIndex = 0;
            const interval = setInterval(() => {
                setChatHistory((prevHistory) => {
                    const updatedHistory = [...prevHistory];
                    updatedHistory[updatedHistory.length - 1].text = finalAnswer.slice(0, currentIndex + 1);
                    return updatedHistory;
                });
                currentIndex++;

                if (currentIndex >= finalAnswer.length) {
                    clearInterval(interval);
                }
            }, 10);

        } catch (error) {
            console.error("Lỗi:", error);
            setChatHistory((prevHistory) => [
                ...prevHistory,
                { type: "ai", text: "Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau." },
            ]);
        } finally {
            setLoading(false);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;
        setChatHistory(prevHistory => [
            ...prevHistory,
            { type: 'user', text: question }
        ]);
        setQuestion('');
        await generateAIResponse(question);
    };

    useEffect(() => {
        if (question.trim() && isVoiceInput) {
            handleSubmit(new Event('submit'));
            setIsVoiceInput(false); 
        }
    }, [question, isVoiceInput]); 
    const convertTextToLinks = (text) => {
        const urlPattern = /https?:\/\/[^\s]+/g;
        return text.replace(urlPattern, (url) => `<a href="${url}" target="_blank" style="color: #1e90ff; text-decoration: none;">${url}</a>`);
    };

    const startVoiceRecognition = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            setQuestion(spokenText); 
            setIsVoiceInput(true); 
        };

        recognition.onerror = (event) => {
            console.error('Error with speech recognition:', event.error);
            setIsListening(false);
        };

        recognition.start();
    };
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
        }}>
            <div
                style={{
                    backgroundColor: '#0033FF',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    animation: 'pulse 2s infinite',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                <Avatar
                    alt="Logo"
                    src="https://cdn-icons-png.flaticon.com/128/8943/8943377.png"
                    sx={{ width: 40, height: 40 }}
                />
            </div>

            {isChatOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '30px',
                    width: '500px',
                    height: '600px',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '15px',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                    }}>
                        <Avatar
                            alt="Logo"
                            src="https://cdn-icons-png.flaticon.com/128/8943/8943377.png"
                            sx={{ width: 40, height: 40, marginRight: '10px' }}
                        />
                        <h1 style={{
                            fontSize: '26px',
                            color: '#333',
                            fontWeight: 'bold',
                            margin: 0,
                        }}>Trợ lý ảo</h1>
                    </div>

                    <Box sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        marginBottom: '20px',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            borderRadius: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: '#e0e0e0',
                            borderRadius: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#9e9e9e',
                            borderRadius: '8px',
                            transition: 'background-color 0.3s ease',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#7e7e7e',
                        },
                        scrollBehavior: 'smooth',
                    }}>
                        {chatHistory.map((msg, index) => (
                            <div key={index} style={{
                                textAlign: msg.type === 'user' ? 'right' : 'left',
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                            }}>
                                {msg.type !== 'user' && (
                                    <Avatar
                                        alt="Bot Avatar"
                                        src="https://cdn-icons-png.flaticon.com/128/8943/8943377.png"
                                        sx={{ width: 40, height: 40, marginRight: 1 }}
                                    />
                                )}
                                <div style={{
                                    backgroundColor: msg.type === 'user' ? '#6ea2ff' : '#f7f7f7',
                                    padding: '15px',
                                    borderRadius: '10px',
                                    maxWidth: '75%',
                                    width: 'fit-content',
                                    margin: msg.type === 'user' ? '5px 0 5px auto' : '5px auto 5px 0',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                    fontSize: '16px',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    textAlign: 'left',
                                    display: 'inline-block',
                                }} dangerouslySetInnerHTML={{ __html: convertTextToLinks(msg.text) }} />
                            </div>
                        ))}
                        <div ref={chatContainerRef} /> {/* Thêm ref để cuộn tự động */}
                    </Box>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Hỏi về sản phẩm..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '4px 8px',
                                borderRadius: '15px',
                                border: '1px solid #ccc',
                                outline: 'none',
                                fontSize: '14px',
                                height: '50px',
                                boxSizing: 'border-box',
                            }}
                        />
                        <IconButton onClick={startVoiceRecognition} color={isListening ? "secondary" : "primary"}>
                            <MicIcon />
                        </IconButton>
                        <IconButton type="submit" color="primary" disabled={loading} style={{
                            padding: '10px',
                        }}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                        </IconButton>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Gemini;