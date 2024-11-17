import React, { useState } from 'react';
import axios from 'axios';
import CategoryService from '../../../services/CategoryServices';
import BrandService from '../../../services/BrandServices';
import ProductService from '../../../services/ProductServices';
import VoucherService from '../../../services/VoucherServices';
import ProductDetailService from '../../../services/ProductDetailServices';

import { CircularProgress, IconButton, Box, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';

function Gemini() {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const getCategoryData = async () => {
        const response = await CategoryService.getAllCategories();
        return response?.data || [];
    };

    const getBrandData = async () => {
        const response = await BrandService.getAllBrands();
        return response?.data || [];
    };

    const getProductData = async () => {
        const response = await ProductService.getAllProducts();
        return response?.data || [];
    };

    const getProductDetailData = async () => {
        const response = await ProductDetailService.getAllProductDetails();
        return response?.data || [];
    };

    const getVoucherData = async () => {
        const response = await VoucherService.getAllVouchers();
        return response?.data || [];
    };

    const detectLanguage = (text) => {
        return /[\u00C0-\u024F]/.test(text) ? 'vi' : 'en';
    };

    const generateAIResponse = async (question) => {
        setLoading(true);
        try {
            const categories = await getCategoryData();
            const brands = await getBrandData();
            const products = await getProductData();
            const productDetails = await getProductDetailData();
            const vouchers = await getVoucherData();
            const language = detectLanguage(question);

            const prompt = `\nCurrent Question: ${question}
            \nData (when available):
            \nCategories: ${JSON.stringify(categories)}
            \nBrands: ${JSON.stringify(brands)}
            \nProducts: ${JSON.stringify(products)}
            \nProductDetails: ${JSON.stringify(productDetails)}
            \nVouchers: ${JSON.stringify(vouchers)}
            \nAnswer in ${language === 'vi' ? 'Vietnamese' : 'English'}.`;

            const API_KEY = process.env.REACT_APP_API_KEY;
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                }
            );

            const aiAnswer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";

            setChatHistory(prevHistory => [
                ...prevHistory,
                { type: 'user', text: question },
                { type: 'ai', text: aiAnswer },
            ]);
        } catch (error) {
            console.error('Error fetching response from Gemini:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!question.trim()) return;
        generateAIResponse(question);
        setQuestion('');
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
                    backgroundColor: '#0033FF', // Màu nền chính
                    borderRadius: '50%', // Đảm bảo là hình tròn
                    width: '60px', // Tăng kích thước một chút cho dễ nhìn
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Tăng bóng đổ để tạo cảm giác nổi
                    animation: 'pulse 2s infinite', // Hiệu ứng nhấp nháy
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Hiệu ứng chuyển động mượt mà
                }}
                onClick={() => setIsChatOpen(!isChatOpen)}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)'; // Hiệu ứng phóng to khi hover
                    e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)'; // Quay lại kích thước ban đầu khi hover out
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                }}
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
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
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
                                borderRadius: '5px',
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