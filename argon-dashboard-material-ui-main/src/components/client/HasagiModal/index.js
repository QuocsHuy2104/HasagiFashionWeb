import React, { useState } from "react";
import "components/client/assets/css/style.css";
import "components/client/assets/css/bootstrap.min.css";
import "components/client/assets/lib/animate/animate.css";

const HasagiModal = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleVoiceSearch = () => {
        // Kiểm tra nếu trình duyệt hỗ trợ Web Speech API
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = 'vi-VN'; // Ngôn ngữ tiếng Việt
            recognition.continuous = false;
            recognition.interimResults = false;

            // Khi nhận diện giọng nói hoàn tất
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript); // Cập nhật kết quả tìm kiếm
            };

            recognition.start(); // Bắt đầu nhận diện giọng nói

            recognition.onerror = (event) => {
                console.error("Lỗi nhận diện giọng nói: ", event.error);
            };
        } else {
            alert("Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói.");
        }
    };

    return (
        <div className="modal fade" id="searchModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h4 className="modal-title mb-0" id="exampleModalLabel">Search by keywordaaaasda</h4>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <button className="btn btn-primary ms-2" onClick={handleVoiceSearch}>
                                Mic 
                            </button>
                    </div>
                    <div className="modal-body d-flex align-items-center">
                        <div className="input-group w-75 mx-auto d-flex">
                            <input
                                type="search"
                                className="form-control p-3"
                                placeholder="keywords"
                                aria-describedby="search-icon-1"
                                value={searchQuery} // Hiển thị kết quả giọng nói
                                onChange={(e) => setSearchQuery(e.target.value)} // Cho phép nhập thủ công
                            />
                            <span id="search-icon-1" className="input-group-text btn border p-3">
                                <i className="fa fa-search text-white"></i>
                            </span>
                            {/* Nút tìm kiếm bằng giọng nói với chữ "Mic" */}
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HasagiModal;
