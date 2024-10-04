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

        if (title === "" || images.length === 0) {
            setMessage({ error: true, msg: "All fields including images are mandatory!" });
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
                setBannerId("");  // Reset banner ID after update
                setMessage({ error: false, msg: "Updated successfully!" });
            } else {
                await BannerDataService.addBanner(newBanner);
                setMessage({ error: false, msg: "New Banner added successfully!" });
            }

            // Reset form fields
            setTitle("");
            setImages([]);
            setPreviewUrls([]);
            document.querySelector('input[type="file"]').value = null;  // Clear file input
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

        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(previewUrls);
    };

    const handleRemoveImage = (index) => {
        // Remove image from images state
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);

        // Remove image from previewUrls state
        const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newPreviewUrls);
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
