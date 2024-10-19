import React, { useEffect, useState, useCallback } from "react";
import BannerDataService from "../../../services/BannerServices";
import { Form, Alert, InputGroup, Button } from "react-bootstrap";
import { storage } from "../../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PropTypes from 'prop-types';

const AddBanner = ({ id, setBannerId }) => {
    const [title, setTitle] = useState("");
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [message, setMessage] = useState({ error: false, msg: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ error: false, msg: "" });
    
        if (title === "" || (images.length === 0 && previewUrls.length === 0)) {
            setMessage({ error: true, msg: "Tất cả các trường bao gồm hình ảnh đều là bắt buộc!" });
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
    
            const updatedImageUrls = [...previewUrls, ...newImageUrls]; 
            const newBanner = { title, imageUrls: updatedImageUrls };
    
            if (id) {
                await BannerDataService.updateBanner(id, newBanner);
                setBannerId(""); 
                setMessage({ error: false, msg: "Cập nhật thành công!" });
            } else {
                await BannerDataService.addBanner(newBanner);
                setMessage({ error: false, msg: "Thêm thành công!" });
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
    

    const handleRemoveImage = (index) => {
        if (index < previewUrls.length) {
            const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
            setPreviewUrls(newPreviewUrls);
        } else {
            const newImages = images.filter((_, i) => i !== (index - previewUrls.length));
            setImages(newImages);
        }
    };

    return (
        <>
            <div className="p-4 box">
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
                    <Form.Group className="mb-2">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Banner Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Control
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            multiple
                        />
                    </Form.Group>

                    {/* Hiển thị ảnh xem trước với dấu x */}
                    <div className="image-preview-container">
                        {previewUrls.length > 0 && previewUrls.map((url, index) => (
                            <div key={index} className="image-preview-wrapper">
                                <img
                                    src={url}
                                    alt={`Preview ${index}`}
                                    className="image-preview"
                                />
                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit">
                            Add/ Update
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
};

AddBanner.propTypes = {
    id: PropTypes.string,
    setBannerId: PropTypes.func.isRequired,
};

export default AddBanner;
