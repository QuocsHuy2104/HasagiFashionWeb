import React, { useState,useEffect } from "react";
import PropTypes from "prop-types";
import "./ProductVariant.css"; // Để tùy chỉnh CSS
import CartService from "../../../services/CartService";
const ProductVariant = ({ variantSize, variantColor, onClose, cartDetailId, productId, colorId, sizeId }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    setSelectedColor(colorId || null);
    setSelectedSize(sizeId || null);
  }, [colorId, sizeId]);

  const handleFormSubmit = async (e) => {
    console.log(`Updating cart with: cartDetailId=${cartDetailId}, colorId=${selectedColor}, sizeId=${selectedSize}, productId=${productId}`);
    e.preventDefault();
    if (selectedColor && selectedSize) {
      try {
        const response = await CartService.getCartUpdate(cartDetailId, selectedColor, selectedSize, productId);
        CartService.getCart();
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
          <h4>Size:</h4>
        </div>
        {variantSize.map((variant) => (
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
          <h4>Color:</h4>
        </div>
        {variantColor.map((variant) => (
          <button
            key={variant.id}
            className={`variant-button ${selectedColor === variant.id ? 'selected' : ''}`}
            onClick={() =>
              setSelectedColor(variant.id)
            }
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
          onClick={handleFormSubmit} 
        >
          Xác nhận
        </button>

      </div>
    </div>
  );
};

ProductVariant.propTypes = {
  variantSize: PropTypes.array.isRequired,
  variantColor: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  cartDetailId: PropTypes.number.isRequired,
  productId: PropTypes.number.isRequired,
  colorId: PropTypes.number.isRequired,
  sizeId: PropTypes.number.isRequired,
};

export default ProductVariant;
