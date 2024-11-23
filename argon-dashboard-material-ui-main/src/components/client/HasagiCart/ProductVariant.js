import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ProductVariant.css"; // Để tùy chỉnh CSS
import CartService from "../../../services/CartService";
const ProductVariant = ({ onClose, cartDetailId, productId, colorId, sizeId }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);


  useEffect(() => {
    setSelectedColor(colorId || null);
    setSelectedSize(sizeId || null);
  }, [colorId, sizeId]);


  const fetchProductOptionsById = async (productId, selectedSizeId) => {
    try {
      const url = selectedSizeId
        ? `http://localhost:3000/api/cart/option/${productId}?selectedSizeId=${selectedSizeId}`
        : `http://localhost:3000/api/cart/option/${productId}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const uniqueColors = [...new Map(data.colors.map(color => [color.id, color])).values()];
      const uniqueSizes = [...new Map(data.sizes.map(size => [size.id, size])).values()];

      setColors(uniqueColors);
      setSizes(uniqueSizes);

      if (uniqueColors.length > 0) setSelectedColor(uniqueColors[0].id);
    } catch (error) {
      console.error("Error fetching product options:", error);
      setError("Failed to fetch product options. Please try again later.");
    }
  };

  useEffect(() => {

    if (productId) {
      fetchProductOptionsById(productId, selectedSize);
    }
  }, [productId, selectedSize]);




  const handleFormSubmit = async (e) => {

    e.preventDefault();
    if (selectedColor && selectedSize) {
      try {
        await CartService.getCartUpdate(cartDetailId, selectedColor, selectedSize, productId);
        onClose();
      } catch (error) {
        setError(error.message || "Failed to update product option");
        console.log("Error during cart update:", error);
        setSuccess(null);
      }
    } else {
      setError("Please select both color and size before submitting");
    }
  };


  return (
    <div className="variant-modal">
      <div className="variant-options">
        <div className="variant-header mt-2">
          <h4>Kích cỡ:</h4>
        </div>
        {sizes.map((variant) => (
          <button
            key={variant.id}
            className={`variant-button ${selectedSize === variant.id ? 'selected' : ''}`}
            onClick={() => setSelectedSize(variant.id)}
          >
            {variant.name}
          </button>


        ))}
      </div>
      <div className="variant-options">
        <div className="variant-header mt-2">
          <h4>Màu sắc:</h4>
        </div>
        {colors.map((variant) => (
          <button
            key={variant.id}
            className={`variant-button ${selectedColor === variant.id ? 'selected' : ''}`}
            onClick={() =>
              setSelectedColor(variant.id)
            }
            disabled={!variant.check}
          >
            {variant.name}
          </button>


        ))}
      </div>

      <div className="variant-footer">
        <button className="back-button" onClick={onClose} style={{ marginRight: "10px" }}>
          Trở lại
        </button>
        <button
          className="confirm-button btn-warning"
          onClick={handleFormSubmit} // Gắn sự kiện onClick
        >
          Xác nhận
        </button>

      </div>
    </div>
  );
};

ProductVariant.propTypes = {
  onClose: PropTypes.func.isRequired,
  cartDetailId: PropTypes.number.isRequired,
  productId: PropTypes.number.isRequired,
  colorId: PropTypes.number.isRequired,
  sizeId: PropTypes.number.isRequired,
};

export default ProductVariant;
