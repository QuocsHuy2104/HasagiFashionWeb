import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, CircularProgress, IconButton, Box, Typography, Avatar } from '@mui/material';
import { Send, ChatBubble } from '@mui/icons-material';
import { styled } from '@mui/system';


const ChatContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
    backgroundColor: '#e3f2fd',
    padding: '16px',
    width: '100%',
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

const ChatContentWrapper = styled(Box)(({ theme }) => ({
    maxWidth: '500px',
    margin: '0 auto',
    width: '100%',
}));

const MessageContainer = styled(Box)(({ isVisible }) => ({
    flexGrow: 1,
    overflowY: isVisible ? 'auto' : 'hidden',
    height: '600px',
    padding: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
}));

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
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const welcomeMessage = {
            text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString(),
        };
        setMessages([welcomeMessage]);
    }, []);

    const generateAnswer = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        const userMessage = { text: question, sender: 'user', timestamp: new Date().toLocaleTimeString() };
        setMessages((prev) => [...prev, userMessage]);
        setQuestion('');
        setLoading(true);

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

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    };

    return (
        <>

            <ChatContainer>
                <IconButton onClick={toggleVisibility} sx={{ marginLeft: 'auto' }}>
                    <ChatBubble />
                </IconButton>
                {isVisible && (
                    <ChatContentWrapper>
                        <Header>
                            <Avatar
                                alt="Logo"
                                src="https://example.com/logo.png"
                                sx={{ width: 40, height: 40 }}
                            />
                            <Logo>Chat Bot</Logo>

                        </Header>

                        <MessageContainer isVisible={isVisible}>
                            {messages.map((message, index) => (
                                <Message key={index} sender={message.sender}>
                                    {message.sender === 'ai' && (
                                        <Avatar
                                            alt="Bot Avatar"
                                            src="https://png.pngtree.com/png-clipart/20190905/original/pngtree-ai-white-technology-robot-head-material-png-image_4512310.jpg"
                                            sx={{ width: 40, height: 40, marginRight: 1 }}
                                        />
                                    )}
                                    <MessageBubble sender={message.sender}>{message.text}</MessageBubble>
                                </Message>
                            ))}
                        </MessageContainer>

                        <ChatInputContainer component="form" onSubmit={generateAnswer}>
                            <TextField
                                placeholder="Type your message..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                fullWidth
                            />
                            <StyledIconButton type="submit" disabled={loading} loading={loading}>
                                {loading ? <CircularProgress size={24} /> : <Send />}
                            </StyledIconButton>
                        </ChatInputContainer>

                    </ChatContentWrapper>
                )}
            </ChatContainer>
        </>



    );
}

export default App;
