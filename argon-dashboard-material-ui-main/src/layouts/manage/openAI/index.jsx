import React, { useState } from 'react';
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import ArgonBox from "../../../components/ArgonBox";
import ArgonButton from "../../../components/ArgonButton"; // Import ArgonButton for styling
import ArgonInput from "../../../components/ArgonInput"; // Import ArgonInput for styled input
import ChatAI from "../../../services/OpenAIServices"; // Import ChatAI service

function OpenAIChat() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
            alert("Prompt không thể để trống!");
            return;
        }
        setLoading(true);

        try {
            const res = await ChatAI.getAIResponse(prompt); // Gọi phương thức từ service
            setResponse(res); // Đặt phản hồi từ service
        } catch (error) {
            console.error("Error fetching AI response:", error); // In ra thông tin lỗi chi tiết
            setResponse('Lỗi: ' + error.message); // Cập nhật phản hồi lỗi
        } finally {
            setLoading(false);
        }
    };


    return (
        <DashboardLayout>
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox p={3}>
                            <h2>OpenAI Chat</h2>
                            <form onSubmit={handleSubmit}>
                                <ArgonInput
                                    type="text"
                                    rows="4"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Nhập câu hỏi của bạn..."
                                    multiline // Để biến input thành textarea
                                    fullWidth // Chiếm toàn bộ chiều rộng
                                />
                                <ArgonButton type="submit" disabled={loading} color="primary">
                                    {loading ? 'Đang xử lý...' : 'Gửi'}
                                </ArgonButton>
                            </form>
                            <div>
                                <h3>Kết quả:</h3>
                                <p>{response}</p>
                            </div>
                        </ArgonBox>
                    </Card>
                </ArgonBox>
            </ArgonBox>
        </DashboardLayout>
    );
}

export default OpenAIChat;
