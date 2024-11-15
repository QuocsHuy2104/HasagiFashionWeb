import React, { useState } from 'react';
import axios from 'axios';
import CategoryService from '../../../services/CategoryServices';
import BrandService from '../../../services/BrandServices';
import ProductService from '../../../services/ProductServices';
import VoucherService from '../../../services/VoucherServices';
import { FaComments } from 'react-icons/fa';

function Gemini() {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat window visibility

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
            const vouchers = await getVoucherData();
            const language = detectLanguage(question);
            const recentChatHistory = chatHistory.slice(-3);

            const prompt = `
                Previous messages:\n${recentChatHistory.map(m => `${m.question} → ${m.answer}`).join("\n")}
                \nCurrent Question: ${question}
                \nData (when available):
                \nCategories: ${JSON.stringify(categories)}
                \nBrands: ${JSON.stringify(brands)}
                \nProducts: ${JSON.stringify(products)}
                \nVouchers: ${JSON.stringify(vouchers)}
                Answer in ${language === 'vi' ? 'Vietnamese' : 'English'}.
            `;

            const API_KEY = process.env.REACT_APP_API_KEY;
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                }
            );

            const aiAnswer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
            setChatHistory([...chatHistory, { question, answer: aiAnswer }]);
            setResponse(aiAnswer);
        } catch (error) {
            console.error('Error fetching response from Gemini:', error);
            setResponse("Lỗi: Không thể lấy phản hồi.");
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

    return (
        <div style={styles.container}>
            <div style={styles.chatIcon} onClick={() => setIsChatOpen(!isChatOpen)}>
                <FaComments size={30} color="#fff" />
            </div>

            {isChatOpen && (
                <div style={styles.chatBox}>
                    <h1 style={styles.header}>Giao Tiếp với AI Gemini</h1>
                    <div style={styles.chatHistory}>
                        {chatHistory.map((message, index) => (
                            <div key={index} style={styles.chatMessage}>
                                <p style={styles.chatQuestion}><strong>Bạn:</strong> {message.question}</p>
                                <p style={styles.chatAnswer}><strong>AI:</strong> {message.answer}</p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} style={styles.inputForm}>
                        <input
                            type="text"
                            placeholder="Hỏi về sản phẩm..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            disabled={loading}
                            style={styles.input}
                        />
                        <button type="submit" disabled={loading} style={styles.button}>
                            {loading ? 'Đang xử lý...' : 'Gửi'}
                        </button>
                    </form>
                    <div style={styles.aiResponse}>
                        <h3>Trả lời từ AI:</h3>
                        <p>{response}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
    },
    chatIcon: {
        backgroundColor: '#4CAF50',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    chatBox: {
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '300px',
        maxWidth: '90%',
        maxHeight: '500px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#4CAF50',
    },
    chatHistory: {
        overflowY: 'auto',
        padding: '10px',
        marginBottom: '10px',
        maxHeight: '300px',
        borderBottom: '1px solid #ddd',
    },
    chatMessage: {
        marginBottom: '10px',
        padding: '8px',
        borderRadius: '5px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
    },
    chatQuestion: {
        fontWeight: 'bold',
        color: '#007bff',
    },
    chatAnswer: {
        color: '#555',
    },
    inputForm: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '10px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        outline: 'none',
    },
    button: {
        padding: '10px 15px',
        borderRadius: '5px',
        border: 'none',
        color: '#fff',
        backgroundColor: '#4CAF50',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    aiResponse: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#f4f4f4',
        borderRadius: '5px',
        border: '1px solid #ddd',
    }
};

export default Gemini;
