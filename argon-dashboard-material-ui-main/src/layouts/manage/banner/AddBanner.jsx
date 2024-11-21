import React, { useEffect, useState, useCallback } from "react";
import BannerDataService from "../../../services/BannerServices";
import { Form, Alert } from "react-bootstrap";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonInput from "../../../components/ArgonInput";
import { storage } from "../../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PropTypes from "prop-types";
import { FaCamera } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBanner = ({ id, setBannerId }) => {
    const [title, setTitle] = useState("");
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [message, setMessage] = useState({ error: false, msg: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ error: false, msg: "" });

        if (title === "" || (images.length === 0 && previewUrls.length === 0)) {
            toast.warn("Vui lòng nhập đầy đủ thông tin!!!");
            return;
        }

        try {
            const newImageUrls = await Promise.all(
                images.map(async (image) => {
                    const imageRef = ref(storage, `banner_images/${image.name}`);
                    const snapshot = await uploadBytes(imageRef, image);
                    return await getDownloadURL(snapshot.ref);
                })
            );

            let existingImageUrls = [];
            if (id) {
                const currentBanner = await BannerDataService.getBanner(id);
                if (currentBanner.exists()) {
                    existingImageUrls = currentBanner.data().imageUrls || [];
                }
            }

            const updatedImageUrls = [...existingImageUrls, ...newImageUrls];
            const newBanner = { title, imageUrls: updatedImageUrls };

            if (id) {
                await BannerDataService.updateBanner(id, newBanner);
                setBannerId("");
                toast.success("Cập nhật thành công!");
            } else {
                await BannerDataService.addBanner(newBanner);
                toast.success("Thêm thành công!");
            }

            setTitle("");
            setImages([]);
            setPreviewUrls([]);
            document.querySelector('input[type="file"]').value = null;
        } catch (err) {
            setMessage({ error: true, msg: err.message });
        }
    };



    const editHandler = useCallback(async () => {
        setMessage("");
        try {
            const docSnap = await BannerDataService.getBanner(id);
            if (docSnap.exists()) {
                const bannerData = docSnap.data();
                setTitle(bannerData.title);
                setPreviewUrls(bannerData.imageUrls);
            }
        } catch (err) {
            setMessage({ error: true, msg: err.message });
        }
    }, [id]);


    useEffect(() => {
        if (id !== undefined && id !== "") {
            editHandler();
        }
    }, [id, editHandler]);


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    };


    const handleRemoveImage = async (index) => {
        try {
            // Nếu index nằm trong `previewUrls`, nghĩa là ảnh cũ
            if (index < previewUrls.length) {
                const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
                setPreviewUrls(newPreviewUrls);

                // Cập nhật lại cơ sở dữ liệu nếu đang trong chế độ chỉnh sửa
                if (id) {
                    const currentBanner = await BannerDataService.getBanner(id);
                    if (currentBanner.exists()) {
                        const existingImageUrls = currentBanner.data().imageUrls || [];
                        const updatedImageUrls = existingImageUrls.filter((_, i) => i !== index);

                        // Cập nhật banner với danh sách URL ảnh mới
                        await BannerDataService.updateBanner(id, {
                            ...currentBanner.data(),
                            imageUrls: updatedImageUrls,
                        });
                    }
                }
            } else {
                // Nếu index thuộc về ảnh mới trong `images`
                const newImages = images.filter((_, i) => i !== (index - previewUrls.length));
                setImages(newImages);
            }
        } catch (err) {
            setMessage({ error: true, msg: `Lỗi khi xóa ảnh: ${err.message}` });
        }
    };
    return (
        <div
            style={{
                background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
                borderRadius: "15px",
                padding: "1rem",
                margin: "0rem auto",
            }}
        >
            {message?.msg && (
                <Alert
                    variant={message?.error ? "danger" : "success"}
                    dismissible
                    onClose={() => setMessage({})}
                >
                    {message?.msg}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <ArgonBox className="mb-3">
                    <Form.Label style={{ fontWeight: "bold", color: "#495057" }}>
                        Tiêu đề
                    </Form.Label>
                    <ArgonInput
                        type="text"
                        placeholder="Nhập tiêu đề"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            borderRadius: "8px",
                            border: "1px solid #ced4da",
                            padding: "0.8rem",
                            fontSize: "1rem",
                        }}
                    />
                </ArgonBox>

                <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "bold", color: "#495057" }}>
                        Thêm ảnh
                    </Form.Label>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Button
                            variant="outline-dark"
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "24px",
                                padding: "0",
                                marginRight: "0.5rem", // khoảng cách giữa nút và ảnh
                            }}
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <FaCamera />
                            <input
                                type="file"
                                id="fileInput"
                                onChange={handleImageChange}
                                accept="image/*"
                                multiple
                                style={{ display: "none" }}
                            />
                        </Button>

                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                                marginTop: "1rem",
                                marginBottom: "1rem",
                            }}
                        >
                            {previewUrls.length > 0 &&
                                previewUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            position: "relative",
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "10px",
                                            overflow: "hidden",
                                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                                            transition: "transform 0.3s",
                                        }}
                                    >
                                        <img
                                            src={url}
                                            alt={`Preview ${index}`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                cursor: "pointer",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            style={{
                                                background: "rgba(0, 0, 0, 0.5)",
                                                border: "none",
                                                color: "white",
                                                fontSize: "1.5rem",
                                                position: "absolute",
                                                top: "5px",
                                                right: "5px",
                                                cursor: "pointer",
                                                borderRadius: "50%",
                                                width: "20px",
                                                height: "20px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                                            }}
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                </Form.Group>



                <ArgonBox mb={3} sx={{ width: { xs: '100%', sm: '50%', md: '20%' } }}>
                    <ArgonButton type="submit" size="large" color="info" fullWidth>
                        {id ? "Cập nhật" : "Thêm"}
                    </ArgonButton>
                </ArgonBox>
            </Form>
        </div>
    );
};

AddBanner.propTypes = {
    id: PropTypes.string,
    setBannerId: PropTypes.func.isRequired,
};

export default AddBanner;
