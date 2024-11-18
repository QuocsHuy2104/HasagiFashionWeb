import React, { useEffect, useState, useCallback } from "react";
import BannerDataService from "../../../services/BannerServices";
import { Form, Alert } from "react-bootstrap";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import { storage } from "../../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PropTypes from "prop-types";

const AddBanner = ({ id, setBannerId }) => {
    const [title, setTitle] = useState("");
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [message, setMessage] = useState({ error: false, msg: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ error: false, msg: "" });

        if (title === "" || images.length === 0) {
            setMessage({
                error: true,
                msg: "All fields including images are mandatory!",
            });
            return;
        }

        try {
            const imageUrls = await Promise.all(
                images.map(async (image) => {
                    const imageRef = ref(storage, `banner_images/${image.name}`);
                    const snapshot = await uploadBytes(imageRef, image);
                    return await getDownloadURL(snapshot.ref);
                })
            );

            const newBanner = { title, imageUrls };

            if (id !== undefined && id !== "") {
                await BannerDataService.updateBanner(id, newBanner);
                setBannerId(""); // Reset banner ID after update
                setMessage({ error: false, msg: "Updated successfully!" });
            } else {
                await BannerDataService.addBanner(newBanner);
                setMessage({
                    error: false,
                    msg: "New Banner added successfully!",
                });
            }

            // Reset form fields
            setTitle("");
            setImages([]);
            setPreviewUrls([]);
            document.querySelector('input[type="file"]').value = null; // Clear file input
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
                const urls = await Promise.all(
                    bannerData.imageUrls.map(async (url) => {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        return URL.createObjectURL(blob);
                    })
                );
                setPreviewUrls(urls);
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

        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(previewUrls);
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);

        const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newPreviewUrls);
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
                <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "bold", color: "#495057" }}>
                        Tiêu đề
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tiêu đề"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            borderRadius: "8px",
                            border: "1px solid #ced4da",
                            padding: "0.75rem",
                            fontSize: "1rem",
                        }}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "bold", color: "#495057" }}>
                        Thêm ảnh
                    </Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                        style={{
                            borderRadius: "8px",
                            border: "1px solid #ced4da",
                            padding: "0.5rem",
                        }}
                    />
                </Form.Group>

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginTop: "1rem",
                        marginBottom: "1rem"
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
                                    boxShadow:
                                        "0px 5px 15px rgba(0, 0, 0, 0.2)",
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