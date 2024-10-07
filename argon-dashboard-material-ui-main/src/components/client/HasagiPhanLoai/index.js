import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Form, FormGroup, Label } from "reactstrap";
import "components/client/assets/css/phanloai1.css";
import Cookies from "js-cookie";

const ColorSelectionModal = ({ show, onClose, onColorSelect, onSizeSelect, productId, cartDetailId }) => {
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (show && productId) {
            fetchProductOptionsById(productId);
        }
    }, [show, productId]);

    const fetchProductOptionsById = async (productId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/cart/option/${productId}`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            const uniqueColors = [...new Map(data.colors.map(color => [color.id, color])).values()];
            const uniqueSizes = [...new Map(data.sizes.map(size => [size.id, size])).values()];
            setColors(uniqueColors);
            setSelectedColor(uniqueColors[0] || null);
            setSizes(uniqueSizes);
            setSelectedSize(uniqueSizes[0] || null);
            setError(null);
        } catch (error) {
            console.error("Error fetching product options:", error);
            resetSelections();
            setError("Failed to fetch product options. Please try again later.");
        }
    };

    const resetSelections = () => {
        setColors([]);
        setSelectedColor(null);
        setSizes([]);
        setSelectedSize(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const accountId = Cookies.get('accountId');
        if (selectedColor && selectedSize) {
            try {
                const response = await fetch(`http://localhost:3000/api/cart/updateOfOption/${cartDetailId}?colorId=${selectedColor.id}&sizeId=${selectedSize.id}&productId=${productId}&accountId=${accountId}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error("Failed to update product option");
                const result = await response.text();
                setSuccess(result);
                setError(null);
                onColorSelect(selectedColor);
                onSizeSelect(selectedSize);
                onClose();
            } catch (error) {
                setError(error.message || "Failed to update product option");
                console.log("Error fetching product options:", error);
                setSuccess(null);
            }
        } else {
            setError("Please select both color and size before submitting");
        }
    };

    if (!show) return null;

    return (
        <div className="modal1">
            <div className="modal1-dialog">
                <div className="modal1-content">
                    <div className="modal1-header" style={{ position: 'relative' }}>
                        <h5 className="modal1-title">Phân loại:</h5>
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '10px',
                                border: 'none',
                                background: 'none',
                                fontSize: '2.5rem',
                                color: 'black',
                                cursor: 'pointer'
                            }}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="modal1-body">
                        {error && <p className="text-danger">{error}</p>}
                        {success && <p className="text-success">{success}</p>}
                        <Form onSubmit={handleFormSubmit}>
                            <FormGroup>
                                <Label>Chọn Màu:</Label>
                                <div className="color-options">
                                    {colors.map((color) => (
                                        <Button
                                            key={color.id}
                                            className={`color-box ${selectedColor?.id === color.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            {color.name}
                                        </Button>
                                    ))}
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label>Chọn Size:</Label>
                                <div className="color-options">
                                    {sizes.map((size) => (
                                        <Button
                                            key={size.id}
                                            className={`color-box ${selectedSize?.id === size.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size.name}
                                        </Button>
                                    ))}
                                </div>
                            </FormGroup>
                            <div className="modal-footer">
                                <Button color="primary" type="submit">
                                    Xác Nhận
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>

    );
};

ColorSelectionModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onColorSelect: PropTypes.func.isRequired,
    onSizeSelect: PropTypes.func.isRequired,
    productId: PropTypes.number.isRequired,
    cartDetailId: PropTypes.number.isRequired,
};

export default ColorSelectionModal;
