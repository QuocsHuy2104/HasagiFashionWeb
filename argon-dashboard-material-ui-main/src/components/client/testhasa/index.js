import React, { useEffect, useState } from 'react';
import ReviewFilesService from '../../../services/ReviewFileServices';
import { storage } from "../../../config/firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ReviewFileList = () => {
    const [reviewFiles, setReviewFiles] = useState([]);
    const [imageFiles, setImageFiles] = useState([]); // Sửa thành mảng để lưu nhiều ảnh
    const [videoFile, setVideoFile] = useState(null); // Thêm state cho video
    const [reviewId, setReviewId] = useState("72");

    // Hàm lấy danh sách file review
    const fetchReviewFiles = async () => {
        try {
            const response = await ReviewFilesService.getAllFileReviews();
            console.log("Fetched review files:", response.data); // Kiểm tra dữ liệu trả về
            setReviewFiles(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách file review:", error);
        }
    };


    const addReviewFile = async () => {
        if (imageFiles.length === 0 || !reviewId) {
            alert("Vui lòng chọn ít nhất một ảnh và nhập ID review.");
            return;
        }

        const imageUrls = []; // Lưu trữ URL các ảnh đã tải lên

        try {
            // Tải từng ảnh lên
            for (const imageFile of imageFiles) {
                const storageRef = ref(storage, `review_files/${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);
                await uploadTask; // Đợi ảnh tải lên xong
                const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                imageUrls.push(imageUrl); // Thêm URL ảnh vào mảng
            }

            // Nếu có video thì tải video lên
            let videoUrl = "";
            if (videoFile) {
                const videoStorageRef = ref(storage, `review_files/${videoFile.name}`);
                const videoUploadTask = uploadBytesResumable(videoStorageRef, videoFile);
                await videoUploadTask; // Đợi video tải lên xong

                videoUrl = await getDownloadURL(videoUploadTask.snapshot.ref);
            }

            // Kiểm tra lại videoUrl có được gán giá trị chưa
            if (!videoUrl && videoFile) {
                console.error("URL video không có giá trị");
                alert("Lỗi khi tải video lên.");
                return;
            }

            // Gửi request POST đến backend với dữ liệu reviewId, imageUrls và videoUrl
            const newReviewFile = {
                imageUrls, // Thêm mảng URL ảnh vào dữ liệu
                videoUrl, // Thêm video URL vào dữ liệu
                reviewId: parseInt(reviewId, 10),
            };

            try {
                await ReviewFilesService.createFileReviews(newReviewFile);
                alert("Thêm file review thành công!");
                fetchReviewFiles(); // Lấy lại danh sách file mới
                setImageFiles([]); // Reset form ảnh
                setVideoFile(null); // Reset video file
                setReviewId(""); // Reset review ID
            } catch (error) {
                console.error("Lỗi khi thêm file review:", error);
                alert("Lỗi khi thêm file review!");
            }
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên:", error);
            alert("Lỗi khi tải ảnh lên!");
        }
    };

    useEffect(() => {
        fetchReviewFiles();
    }, []);

    return (
        <div>
            <h1>Danh sách file review</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>URL Ảnh</th>
                        <th>Video URL</th>
                    </tr>
                </thead>
                <tbody>
                    {reviewFiles.map((file) => (
                        <tr key={file.id}>
                            <td>{file.id}</td>
                            <td>
                                {file.imageUrl ? (
                                    <img
                                        src={file.imageUrl} // Lấy URL ảnh từ trường imageUrl
                                        alt="Review"
                                        style={{ width: '100px', marginRight: '10px' }}
                                    />
                                ) : (
                                    <span>Không có ảnh</span>
                                )}
                            </td>

                            <td>
                                <a href={file.videoUrl} target="_blank" rel="noopener noreferrer">Xem video</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Thêm file review mới</h2>
            <input
                type="file"
                accept="image/*"
                multiple // Cho phép chọn nhiều ảnh
                onChange={(e) => setImageFiles([...e.target.files])} // Lưu mảng ảnh
            />
            <input
                type="file"
                accept="video/*" // Chỉ cho phép chọn video
                onChange={(e) => setVideoFile(e.target.files[0])}
            />
            <input
                type="number"
                value={reviewId}
                onChange={(e) => setReviewId(e.target.value)}
                placeholder="Nhập ID review"
            />
            <button onClick={addReviewFile}>Thêm file</button>
        </div>
    );
};

export default ReviewFileList;
